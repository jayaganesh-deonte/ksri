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

const CHAIR_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri-prod_admin_master_table";

// GET Chair
chairRouter.get("/chair", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: CHAIR_TABLE,
      IndexName: "entityTypeSK",
      KeyConditionExpression: "entityType = :entityType",
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
      TableName: CHAIR_TABLE,
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
    const { name, id } = req.body;
    const params = {
      TableName: CHAIR_TABLE,
      Key: {
        PK: name,
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
