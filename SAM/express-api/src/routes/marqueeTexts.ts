import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  MarqueeText,
  MarqueeTextDDB,
  fromDynamoDB,
  toDynamoDB,
  validateMarqueeText,
} from "../models/marqueeTexts";

export const marqueeTextsRouter = express.Router();

const MARQUEETEXTS_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET Marquee Texts
marqueeTextsRouter.get("/marqueetexts", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: MARQUEETEXTS_TABLE,
      IndexName: "entityTypePK",
      KeyConditionExpression: "entityType = :sk",
      ExpressionAttributeValues: {
        ":sk": "ENTITYTYPE#MARQUEETEXT",
      },
      //   id is lexagraphically sorted so sort it from old to new
      ScanIndexForward: true,
    });
    res.json(result.Items?.map((item) => fromDynamoDB(item as MarqueeTextDDB)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST Marquee Texts
marqueeTextsRouter.post(
  "/marqueetexts",
  async (req: Request, res: Response) => {
    try {
      const marqueetext: MarqueeText = req.body;
      if (!validateMarqueeText(marqueetext)) {
        return res.status(400).json({ error: "Invalid marqueetext data" });
      }
      const marqueetextDDB: MarqueeTextDDB = toDynamoDB(marqueetext);
      await documentClient.put({
        TableName: MARQUEETEXTS_TABLE,
        Item: marqueetextDDB,
      });
      res.status(201).json(marqueetext);
    } catch (error) {
      console.error("Error creating marqueetext:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// DELETE Marquee Texts
marqueeTextsRouter.delete(
  "/marqueetexts",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const params = {
        TableName: MARQUEETEXTS_TABLE,
        Key: {
          PK: id,
          SK: id,
        },
      };
      await documentClient.delete(params);
      res.status(200).json({ message: "Marquee Text deleted successfully" });
    } catch (error) {
      console.error("Error deleting marqueetext:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
