import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  GoverningBodyMember,
  GoverningBodyMemberDDB,
  toDynamoDB,
  fromDynamoDB,
  validateGoverningBodyMember,
} from "../models/governingBodyMembers";

export const governingBodyMembersRoute = express.Router();

// CREATE GoverningBodyMember
governingBodyMembersRoute.post(
  "/governing-body-members",
  async (req: Request, res: Response) => {
    try {
      const governingBodyMemberData: GoverningBodyMember = req.body;

      // Validate GoverningBodyMember data
      if (!validateGoverningBodyMember(governingBodyMemberData)) {
        return res.status(400).json({
          error:
            "Invalid GoverningBodyMember data. Ensure id, name, subtitle and designation are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(governingBodyMemberData);

      // Put item in DynamoDB
      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: dynamoDBItem,
      });

      res.status(200).json(dynamoDBItem);
    } catch (error) {
      console.error("Error creating GoverningBodyMember:", error);
      res.status(500).json({ error: "Failed to create GoverningBodyMember" });
    }
  }
);

// GET GoverningBodyMembers
governingBodyMembersRoute.get(
  "/governing-body-members",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        ScanIndexForward: false,
        KeyConditionExpression: "PK = :PK",
        ExpressionAttributeValues: {
          ":PK": "ENTITYTYPE#GOVERNINGBODYMEMBER",
        },
      });

      const governingBodyMembers = result.Items?.map((item) =>
        fromDynamoDB(item as GoverningBodyMemberDDB)
      );

      res.json(governingBodyMembers);
    } catch (error) {
      console.error("Error fetching GoverningBodyMembers:", error);
      res.status(500).json({ error: "Failed to fetch GoverningBodyMembers" });
    }
  }
);

// DELETE GoverningBodyMember
governingBodyMembersRoute.delete(
  "/governing-body-members",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "GoverningBodyMember ID is required" });
      }

      // Delete item from DynamoDB
      await documentClient.delete({
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#GOVERNINGBODYMEMBER",
          SK: id,
        },
      });

      res
        .status(200)
        .json({ message: "GoverningBodyMember deleted successfully" });
    } catch (error) {
      console.error("Error deleting GoverningBodyMember:", error);
      res.status(500).json({ error: "Failed to delete GoverningBodyMember" });
    }
  }
);
