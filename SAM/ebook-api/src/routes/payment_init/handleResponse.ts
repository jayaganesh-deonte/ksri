import express, { Request, Response } from "express";

export const handlePaymentRouter = express.Router();

import { updatePaymentStatus } from "./payment";
// import { EmailService } from "../../services/sendEmail";

import { ConfigureCCAvenue } from "../../services/ccavenueUtils";
import { Logger } from "@aws-lambda-powertools/logger";

import { publishToEventBridge } from "../../services/eventBridge";

const ccavenueUtils = new ConfigureCCAvenue();

const logger = new Logger();

handlePaymentRouter.post(
  "/purchase/api/handleResponse",
  async (req: Request, res: Response) => {
    try {
      console.log("/purchase/api/handleResponse ", req.body);
      // Handle base64 encoded body
      let body;
      if (req.body) {
        const decodedBody = Buffer.from(req.body, "base64").toString("utf-8");

        // Parse URL encoded form data
        body = Object.fromEntries(new URLSearchParams(decodedBody).entries());
      } else {
        body = req.body;
      }

      // console.log("body", body);
      logger.info("body", { body: body });

      // Get the encrypted response - handle both encResp and other possible parameters
      const encResp = body.encResp;

      if (!encResp) {
        throw new Error("Missing encrypted response");
      }

      // Process the encrypted response
      await ccavenueUtils.init();
      const data = ccavenueUtils.redirectResponseToJson(encResp);

      logger.info("decrypted data", { data: data });

      const orderStatus = data.order_status;

      logger.info("orderStatus", { orderStatus: orderStatus });

      // const paymentStatus = orderStatus === "Success" ? "COMPLETED" : "FAILED";
      let paymentStatus = "FAILED";

      if (orderStatus == "Success") {
        paymentStatus = "COMPLETED";
      } else {
        paymentStatus = "FAILED";
      }

      // Update payment status in the database
      const payment = await updatePaymentStatus(
        data.order_id,
        paymentStatus,
        data.payment_mode
      );
      // console.log("updateRes", payment);
      logger.info("updateRes", { updateRes: payment });

      // const emailService = await EmailService.init();

      const BASE_URL = process.env.BASE_URL || "http://ksri.in/";

      if (orderStatus == "Success") {
        // try {
        //   const idNumber = payment.panNumber
        //     ? `PAN: ${payment.panNumber}`
        //     : payment.aadharNumber
        //     ? `Aadhar: ${payment.aadharNumber}`
        //     : payment.passportNumber
        //     ? `Passport: ${payment.passportNumber}`
        //     : ""; // send email
        //   const emailDataVariables = {
        //     name: payment.name,
        //     address:
        //       payment.address + ", " + payment.city + ", " + payment.state,
        //     panNumber: idNumber,
        //     amountInWords: payment.amountInWords,
        //     paymentMethod: payment.paymentMethod,
        //     date: payment.paymentDate,
        //     receiptLink:
        //       BASE_URL +
        //       "public/receipt/donation?emailId=" +
        //       payment.email +
        //       "&paymentRefId=" +
        //       payment.paymentRefId,
        //     paymentRefId: payment.orderId,
        //   };
        //   // console.log("emailDataVariables", emailDataVariables);
        //   const emailResponse = await emailService.sendEmail(
        //     payment.email,
        //     emailDataVariables
        //   );
        //   // console.log("Email response:", emailResponse);
        // } catch (error) {
        //   console.error("Error processing CCAvenue request:", error);
        // }
        // publish event to event bridge
        const eventBridgeResponse = await publishToEventBridge(
          process.env.EVENT_BUS_NAME || "default",
          "ksriApi",
          "payment.purchase.completed",
          {
            payment: payment,
          }
        );
        logger.info("EventBridge response:", { eventBridgeResponse });
      }

      // Determine redirect URL based on payment status
      const redirectUrl =
        orderStatus === "Success"
          ? `/purchase/success/?order_id=${data.order_id}&status=${orderStatus}&email=${payment.email}`
          : `/purchase/failed/?order_id=${data.order_id}&status=${orderStatus}`;

      // Redirect to appropriate URL
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error processing CCAvenue request:", error);
      res.redirect("/purchase/failed");
    }
  }
);
