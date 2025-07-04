import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import { Payment, PaymentDDB, fromDynamoDB } from "../models/payments/payment";

import { getUserDetails } from "../cognito/decrypt";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient();

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
          ":paymentStatus": "COMPLETED",
        },
        // filter with paymentStatus as COMPLETED
        FilterExpression: "paymentStatus = :paymentStatus",
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

// ebook url
// get params: bookId, email. first check if user has bought the book. then return the url
//
ebookRouter.get("/ebookUrl/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  // get auth
  console.log("headers", req.headers);
  const token = req.headers["x-amz-id-token"] as string;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userDetails = await getUserDetails(token);

  const email = userDetails?.email;

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
      const payments = data.Items.map((item) =>
        fromDynamoDB(item as PaymentDDB)
      );

      // get book info using PK= ENTITYTYPE#BOOK and SK = bookId
      const bookParams = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#BOOK",
          SK: bookId,
        },
      };
      const bookData = await documentClient.get(bookParams);
      if (bookData.Item) {
        const book = bookData.Item;
        const cloudfrontDomain = process.env.EBOOK_CLOUDFRONT;
        const resourcePath = book.ebookUrl[0].s3Key;

        // Get the private key from SSM Parameter Store

        const privateKeyParam = await ssmClient.send(
          new GetParameterCommand({
            Name:
              process.env.CLOUDFRONT_PRIVATE_KEY_PARAM_NAME ||
              "/cloudfront/ebook/privateKey",
            WithDecryption: true,
          })
        );

        const keyPairIdParam = process.env.CLOUDFRONT_KEY_PAIR_ID_PARAM_NAME;
        const privateKey = privateKeyParam.Parameter?.Value;
        const keyPairId = keyPairIdParam;

        if (!privateKey || !keyPairId) {
          throw new Error("Failed to retrieve CloudFront signing keys");
        }

        // Generate a signed URL that expires in 5 minutes
        const expiresInSeconds = 300; // 5 minutes
        const dateLessThan = new Date(Date.now() + expiresInSeconds * 1000);

        const url = getSignedUrl({
          url: `${cloudfrontDomain}/${resourcePath}`,
          keyPairId: keyPairId,
          privateKey: privateKey,
          dateLessThan: dateLessThan.toISOString(),
        });

        const plainUrl = `${cloudfrontDomain}/${resourcePath}`;

        res.status(200).json({ url: url });
      } else {
        res.status(200).json({ url: "" });
      }
    } else {
      res.status(200).json({ url: "" });
    }
  } catch (error) {
    console.error("Error fetching ebook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { ebookRouter };
