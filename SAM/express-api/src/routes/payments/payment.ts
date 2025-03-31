import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Payment,
  PaymentDDB,
  toDynamoDB,
  fromDynamoDB,
  validatePaymentDDB,
  validatePayment,
} from "../../models/payments/payment";

import { EmailService } from "../../services/sendEmail";
import { publishToEventBridge } from "../../services/eventBridge";

import {
  ConfigureCCAvenue,
  OrderParams,
  getCcAvenueCred,
} from "../../services/ccavenueUtils";
import { convertAmountToWords } from "../../services/convertAmountToWords";
import { validateCloudflareTurnstileToken } from "../../services/cloudflareTurnstile";

const paymentRouter = express.Router();

async function getPayments(req: Request, res: Response) {
  let { startDate, endDate } = req.query;

  //   if startDate and endDate are not provided, the default it to current month
  if (!startDate || !endDate) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const endOfMonth = new Date(now);
    startDate = startOfMonth.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
    endDate = endOfMonth.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD  }
  }

  const params = {
    TableName: process.env.DDB_TABLE_NAME,
    IndexName: "PaymentDateIndex",
    KeyConditionExpression:
      "PK = :PK AND paymentDate BETWEEN :startDate AND :endDate",
    ExpressionAttributeValues: {
      ":PK": "ENTITYTYPE#PAYMENT",
      ":startDate": startDate,
      ":endDate": endDate,
    },
    ScanIndexForward: false,
  };

  try {
    const result = await documentClient.query(params);
    const payments: Payment[] =
      result.Items?.map((item: Record<string, any>) => {
        const paymentDDB = item as PaymentDDB;
        // if (!validatePaymentDDB(paymentDDB)) {
        //   throw new Error("Invalid payment data");
        // }
        return fromDynamoDB(paymentDDB);
      }) || [];
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Error fetching payments" });
  }
}

// get payment for month using GSI PaymentDateIndex: PK = "ENTITYTYPE#PAYMENT" & paymentDate between range
paymentRouter.get("/payments", async (req: Request, res: Response) => {
  await getPayments(req, res);
});

paymentRouter.get("/payments/manual", async (req: Request, res: Response) => {
  await getPayments(req, res);
});

// GET new OrderID
const getNewOrderId = async () => {
  // increment currentOrderId by one and get the new value
  const params = {
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
      PK: "ENTITYTYPE#PAYMENT#DONATION#CURRENT_ORDER_ID",
      SK: "ENTITYTYPE#PAYMENT#DONATION#CURRENT_ORDER_ID",
    },
    UpdateExpression: "SET orderId = if_not_exists(orderId, :zero) + :incr",
    ExpressionAttributeValues: {
      ":incr": 1,
      ":zero": 0,
    },
    ReturnValues: "UPDATED_NEW" as const,
  };
  try {
    const result = await documentClient.update(params);
    if (!result.Attributes) {
      throw new Error("Failed to retrieve new OrderID");
    }
    return result.Attributes.orderId;
  } catch (error) {
    console.error("Error getting new OrderID:", error);
    throw error;
  }
};

// CREATE Payment
paymentRouter.post("/payments", async (req: Request, res: Response) => {
  try {
    const payment: Payment = req.body;

    if (!validatePayment(payment)) {
      return res.status(400).json({
        error: "Invalid Payment data. Ensure all required fields are present.",
      });
    }

    const paymentDDB = toDynamoDB(payment);

    await documentClient.put({
      TableName: process.env.DDB_TABLE_NAME,
      Item: paymentDDB,
    });

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error creating Payment:", error);
    res.status(500).json({ error: "Failed to create Payment" });
  }
});

//  update payment status
paymentRouter.put("/payments", async (req: Request, res: Response) => {
  // get paymentRefId from request body
  const { paymentRefId, paymentStatus } = req.body;
  try {
    // get new OrderID
    await updatePaymentStatus(paymentRefId, paymentStatus, "");

    res.status(200).json({
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

//  CREATE Manual payment entry
paymentRouter.post("/payments/manual", async (req: Request, res: Response) => {
  try {
    const emailService = await EmailService.init();

    const payment: Payment = req.body;

    if (!validatePayment(payment)) {
      return res.status(400).json({
        error: "Invalid Payment data. Ensure all required fields are present.",
      });
    }

    // check if paymentRefId already exists
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#PAYMENT",
        SK: payment.paymentRefId,
      },
    };
    const result = await documentClient.get(params);
    if (result.Item) {
      return res.status(400).json({
        error: "Payment with this payment Reference ID already exists",
      });
    }

    const orderId = await getNewOrderId();
    payment.orderId = orderId;

    const paymentDDB = toDynamoDB(payment);

    await documentClient.put({
      TableName: process.env.DDB_TABLE_NAME,
      Item: paymentDDB,
    });

    const BASE_URL = process.env.BASE_URL || "http://ksri.in/";

    // send email
    const emailDataVariables = {
      name: payment.name,
      address: payment.address + ", " + payment.city + ", " + payment.state,
      panNumber: payment.panNumber,
      amountInWords: paymentDDB.amountInWords,
      paymentMethod: payment.paymentMethod,
      date: payment.paymentDate,
      receiptLink:
        BASE_URL +
        "public/receipt/donation?emailId=" +
        payment.email +
        "&paymentRefId=" +
        payment.paymentRefId,
      paymentRefId: payment.orderId,
    };

    const emailResponse = await emailService.sendEmail(
      payment.email,
      emailDataVariables
    );
    console.log("Email response:", emailResponse);

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error creating Payment:", error);
    res.status(500).json({ error: "Failed to create Payment" });
  }
});

// GET encrypted payment URL
paymentRouter.post(
  "/public/payments/initiatePayment",
  async (req: Request, res: Response) => {
    // 1. generate encrypted url for payment
    // 2. store payment details in dynamodb as initiated
    // 3. return encrypted url to client
    try {
      const validateToken = await validateCloudflareTurnstileToken(req);
      console.log("validateToken", validateToken);
    } catch (error) {
      console.error("Error validating token:", error);
    }

    try {
      let orderParams: OrderParams = req.body;

      // merchant_id: string;
      // redirect_url: string;
      // cancel_url: string;

      const ccAvenueCreds = await getCcAvenueCred();

      orderParams.merchant_id = ccAvenueCreds.merchatId;
      orderParams.redirect_url =
        ccAvenueCreds.redirectUrl +
        "/public/api/payment/donation/handleResponse";
      orderParams.cancel_url =
        ccAvenueCreds.redirectUrl +
        "/public/api/payment/donation/handleResponse";

      const ccavenueUtils = new ConfigureCCAvenue();
      await ccavenueUtils.init();

      const encryptedData = ccavenueUtils.getEncryptedOrder(orderParams);

      const ACCESS_CODE = ccAvenueCreds.accessCode;
      // Redirect to CCAvenue payment page
      const paymentUrl = `https://${ccAvenueCreds.ccAvenueDomain}.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encryptedData}&access_code=${ACCESS_CODE}`;

      // convert orderParam to Payment object
      const payment: Payment = {
        paymentType: "Donation",
        amount: Number(orderParams.amount),
        amountInWords: convertAmountToWords(Number(orderParams.amount)),
        paymentDate: new Date().toISOString().split("T")[0],
        paymentStatus: "INITIATED",
        name: orderParams.billing_name,
        orderId: "PENDING",
        email: orderParams.billing_email,
        phoneNumber: orderParams.billing_tel,
        paymentRefId: orderParams.order_id,
        paymentMethod: "ccavenue",
        panNumber: orderParams.merchant_param1,
        aadharNumber: orderParams.merchant_param2,
        passportNumber: orderParams.merchant_param3,
        passportExpiryDate: orderParams.merchant_param4,
        address: orderParams.billing_address,
        city: orderParams.billing_city,
        state: orderParams.billing_state,
        zip: orderParams.billing_zip,
        country: orderParams.billing_country,
        itemPublishStatus: "PUBLISHED",
      };

      // store payment details in dynamodb as initiated
      const paymentDDB = toDynamoDB(payment);

      console.log("PaymentDDB:", paymentDDB);

      const dbRes = await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: paymentDDB,
      });
      console.log("Payment stored in DDB:", dbRes);

      // publish event to event bridge
      const eventBridgeResponse = await publishToEventBridge(
        process.env.EVENT_BUS_NAME || "default",
        "ksriApi",
        "payment.initiate",
        {
          payment: paymentDDB,
        }
      );
      console.log("EventBridge response:", eventBridgeResponse);

      res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error("Error creating Payment:", error);
      res.status(500).json({ error: "Failed to create Payment" });
    }
  }
);
async function updatePaymentStatus(
  paymentRefId: any,
  paymentStatus: any,
  paymentMethod: string
) {
  let orderId;
  if (paymentStatus == "COMPLETED") {
    orderId = await getNewOrderId();
  } else {
    orderId = "FAILED";
  }

  console.log("orderId", orderId);
  console.log("paymentStatus", paymentStatus);
  console.log("paymentMethod", paymentMethod);

  const params = {
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
      PK: "ENTITYTYPE#PAYMENT",
      SK: paymentRefId,
    },
    UpdateExpression:
      "SET paymentStatus = :paymentStatus , orderId = :orderId, paymentMethod = :paymentMethod ",
    ExpressionAttributeValues: {
      ":paymentStatus": paymentStatus,
      ":orderId": orderId,
      ":paymentMethod": paymentMethod,
    },
    ReturnValues: "ALL_NEW" as const,
  };
  const result = await documentClient.update(params);
  if (!result.Attributes) {
    throw new Error("Failed to update payment status");
  }
  return result.Attributes as PaymentDDB;
}

export { paymentRouter, updatePaymentStatus };
