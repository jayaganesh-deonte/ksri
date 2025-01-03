import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  Chair,
  ChairDDB,
  toDynamoDB,
  fromDynamoDB,
  validateChairDDB,
  validateChair,
} from "../models/chair";

export const chairRouter = express.Router();

// GET Chair
chairRouter.get("/chair", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: process.env.DDB_TABLE_NAME,
      // IndexName: "entityTypeSK",
      KeyConditionExpression: "PK = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#CHAIR",
      },
      //   id is lexagraphically sorted so sort it from old to new
      ScanIndexForward: false,
    });
    res.json(result.Items!.map((item) => fromDynamoDB(item as ChairDDB)));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from DynamoDB" });
  }
});

// POST Chair
chairRouter.post("/chair", async (req: Request, res: Response) => {
  const chair: Chair = req.body;
  if (!validateChair(chair)) {
    return res.status(400).json({ error: "Invalid chair data" });
  }
  const chairDDB: ChairDDB = toDynamoDB(chair);
  try {
    await documentClient.put({
      TableName: process.env.DDB_TABLE_NAME,
      Item: chairDDB,
    });
    res.status(200).json(chair);
  } catch (error) {
    console.error("Error creating chair:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE Chair
chairRouter.delete("/chair", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#CHAIR",
        SK: id,
      },
    };
    await documentClient.delete(params);
    res.status(200).json({ message: "Chair deleted successfully" });
  } catch (error) {
    console.error("Error deleting chair:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
