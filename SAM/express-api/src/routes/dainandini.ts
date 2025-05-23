import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  Dainandini,
  DainandiniDDB,
  fromDynamoDB,
  toDynamoDB,
  validateDainandini,
} from "../models/dainandini";

export const dainandiniRouter = express.Router();

// GET Dainandini
dainandiniRouter.get("/dainandini", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: process.env.DDB_TABLE_NAME,
      // IndexName: "entityTypeSK",
      KeyConditionExpression: "PK = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#DAINANDINI",
      },
      //   id is lexagraphically sorted so sort it from old to new
      ScanIndexForward: true,
    });
    res.json(result.Items?.map((item) => fromDynamoDB(item as DainandiniDDB)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST Dainandini
dainandiniRouter.post("/dainandini", async (req: Request, res: Response) => {
  try {
    const dainandini: Dainandini = req.body;
    if (!validateDainandini(dainandini)) {
      return res.status(400).json({ error: "Invalid dainandini data" });
    }
    const dainandiniDDB: DainandiniDDB = toDynamoDB(dainandini);
    await documentClient.put({
      TableName: process.env.DDB_TABLE_NAME,
      Item: dainandiniDDB,
    });
    res.status(200).json(dainandini);
  } catch (error) {
    console.error("Error creating dainandini:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE Dainandini
dainandiniRouter.delete("/dainandini", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#DAINANDINI",
        SK: id,
      },
    };
    await documentClient.delete(params);
    res.status(200).json({ message: "Dainandini deleted successfully" });
  } catch (error) {
    console.error("Error deleting dainandini:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add a router /public/dainandini for GET
dainandiniRouter.get(
  "/public/dainandini",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        KeyConditionExpression: "PK = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#DAINANDINI",
          ":itemPublishStatus": "PUBLISHED",
        },
        //   id is lexagraphically sorted so sort it from old to new
        ScanIndexForward: false,
        // filter published
        FilterExpression: "itemPublishStatus = :itemPublishStatus",
      });
      res.json(
        result.Items?.map((item) => fromDynamoDB(item as DainandiniDDB))
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
