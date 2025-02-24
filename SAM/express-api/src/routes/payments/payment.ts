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

export const paymentRouter = express.Router();

async function getPayments(req: Request, res: Response) {
  let { startDate, endDate } = req.query;

  //   if startDate and endDate are not provided, the default it to current month
  if (!startDate || !endDate) {
    const now = new Date("2025-02-20");
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    startDate = startOfMonth.toISOString().split("T")[0];
    endDate = endOfMonth.toISOString().split("T")[0];
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
    const orderId = await getNewOrderId();

    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#PAYMENT",
        SK: paymentRefId,
      },
      UpdateExpression:
        "SET paymentStatus = :paymentStatus , orderId = :orderId",
      ExpressionAttributeValues: {
        ":paymentStatus": paymentStatus,
        ":orderId": orderId,
      },
      ReturnValues: "UPDATED_NEW" as const,
    };
    const result = await documentClient.update(params);
    if (!result.Attributes) {
      throw new Error("Failed to update payment status");
    }

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
      amountInWords: paymentDDB.amountInWords,
      paymentMethod: payment.paymentMethod,
      date: payment.paymentDate,
      receiptLink:
        BASE_URL +
        "public/receipt/donation?emailId=" +
        payment.email +
        "&paymentRefId=" +
        payment.orderId,
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
