import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import { Payment, PaymentDDB, fromDynamoDB } from "../models/payments/payment";

const ebookRouter = express.Router();

// check if the user has already bought book
// query ddb using GSI: email-BookIdIndex
ebookRouter.get(
  "/ebook/:email/:bookId",
  async (req: Request, res: Response) => {
    const email = req.params.email;
    const bookId = req.params.bookId;

    try {
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        IndexName: "email-BookIdIndex",
        KeyConditionExpression: "email = :email and bookId = :bookId",
        ExpressionAttributeValues: {
          ":email": email,
          ":bookId": bookId,
        },
      };

      const data = await documentClient.query(params);
      if (data.Items && data.Items.length > 0) {
        res.status(200).json({ bought: true });
      } else {
        res.status(200).json({ bought: false });
      }
    } catch (error) {
      console.error("Error fetching ebook status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// get all books bought by the user
// query ddb using GSI: email-BookIdIndex
ebookRouter.get("/ebook/:email", async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      IndexName: "email-BookIdIndex",
      //   filter paymentStatus = "COMPLETED"
      FilterExpression: "paymentStatus = :paymentStatus",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
        ":paymentStatus": "COMPLETED",
      },
    };

    const data = await documentClient.query(params);
    if (data.Items && data.Items.length > 0) {
      const payments = data.Items.map((item) =>
        fromDynamoDB(item as PaymentDDB)
      );
      res.status(200).json(payments);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching ebook status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get cloudfront signed URL

export { ebookRouter };
