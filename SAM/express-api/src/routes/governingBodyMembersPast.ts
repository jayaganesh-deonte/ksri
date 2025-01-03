import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  GoverningBodyMemberPast,
  GoverningBodyMemberPastDDB,
  toDynamoDB,
  fromDynamoDB,
  validateGoverningBodyMemberPast,
} from "../models/governingBodyMembersPast";

export const governingBodyMembersPastRouter = express.Router();

// GET PAST GoverningBodyMembers
governingBodyMembersPastRouter.get(
  "/governing-body-members-past",
  async (req: Request, res: Response) => {
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      // IndexName: "entityTypeSK",
      ScanIndexForward: false,
      KeyConditionExpression: "PK = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#GOVERNINGBODYMEMBERPAST",
      },
    };

    try {
      const data = await documentClient.query(params);

      const governingBodyMembersPast = data.Items?.map((item) =>
        fromDynamoDB(item as GoverningBodyMemberPastDDB)
      );

      res.json(governingBodyMembersPast);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving governing body members");
    }
  }
);

// CREATE GoverningBodyMemberPast
governingBodyMembersPastRouter.post(
  "/governing-body-members-past",
  async (req: Request, res: Response) => {
    const governingBodyMemberPastData: GoverningBodyMemberPast = req.body;

    if (!validateGoverningBodyMemberPast(governingBodyMemberPastData)) {
      return res.status(400).json({
        error: "Invalid GoverningBodyMemberPast data",
      });
    }

    const dynamoDBItem = toDynamoDB(governingBodyMemberPastData);

    try {
      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: dynamoDBItem,
      });
      res.status(200).json(governingBodyMemberPastData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating GoverningBodyMemberPast");
    }
  }
);

// DELETE GoverningBodyMemberPast
governingBodyMembersPastRouter.delete(
  "/governing-body-members-past",
  async (req: Request, res: Response) => {
    const { id } = req.body;

    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#GOVERNINGBODYMEMBERPAST",
        SK: id,
      },
    };

    try {
      await documentClient.delete(params);
      res.status(200).json({ message: "GoverningBodyMemberPast deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting GoverningBodyMemberPast");
    }
  }
);
