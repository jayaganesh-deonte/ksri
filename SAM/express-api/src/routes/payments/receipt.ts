import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Payment,
  PaymentDDB,
  fromDynamoDB,
} from "../../models/payments/payment";

import { generateReceiptPDF } from "../../services/donationReceipt";

export const receiptRouter = express.Router();

// GET payment details by paymentRefId which is SK
receiptRouter.get(
  "/public/receipt/donation",
  async (req: Request, res: Response) => {
    try {
      const paymentRefId = req.query.paymentRefId as string;
      const emailId = req.query.emailId as string;
      if (!emailId) {
        return res.status(400).json({ error: "Email ID is required" });
      }
      if (!paymentRefId) {
        return res.status(400).json({ error: "Payment ID is required" });
      }

      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#PAYMENT",
          SK: paymentRefId,
        },
      };
      const result = await documentClient.get(params);
      if (!result.Item) {
        return res.status(404).json({ error: "Payment not found" });
      }
      const paymentDDB: PaymentDDB = result.Item as PaymentDDB;
      //   if (!validatePaymentDDB(paymentDDB)) {
      //     return res.status(400).json({
      //       error:
      //         "Invalid Payment data. Ensure all required fields are present.",
      //     });
      //   }
      const payment: Payment = fromDynamoDB(paymentDDB);

      //  validate if the emailId matches the email in the payment
      if (payment.email !== emailId) {
        return res.status(400).json({
          error: "Email ID does not match the email in the payment",
        });
      }

      //   generate pdf
      const pdfBuffer = await generateReceiptPDF(payment);
      res.setHeader("Content-Type", "application/pdf");
      const filename = `receipt-${payment.orderId}.pdf`;
      res.setHeader("Content-Disposition", "attachment; filename= " + filename);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error fetching Payment:", error);
      res.status(500).json({ error: "Failed to fetch Payment" });
    }
  }
);
