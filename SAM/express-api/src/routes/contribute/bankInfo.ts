import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  BankInfo,
  BankInfoDDB,
  toDynamoDB,
  fromDynamoDB,
  isBankInfo,
} from "../../models/contribute/bankInfo";

export const bankInfoRoute = express.Router();

// CREATE BankInfo
bankInfoRoute.post(
  "/contribute/bankInfo",
  async (req: Request, res: Response) => {
    try {
      const bankInfoData: BankInfo = req.body;

      if (!isBankInfo(bankInfoData)) {
        return res.status(400).json({
          error:
            "Invalid bank info data. Ensure name, bankName, accountNo, ifsc and micr are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(bankInfoData);
      // Put item in DynamoDB
      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: dynamoDBItem,
      });
      res.status(200).json(bankInfoData);
    } catch (error) {
      console.error("Error creating bank info:", error);
      res.status(500).json({ error: "Failed to create bank info" });
    }
  }
);

// GET BankInfo
bankInfoRoute.get(
  "/contribute/bankInfo",
  async (req: Request, res: Response) => {
    try {
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        KeyConditionExpression: "PK = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#BANKINFO",
        },
        // IndexName: "entityTypeSK",
        ScanIndexForward: false,
      };

      const { Items } = await documentClient.query(params);

      const bankInfo =
        Items?.map((item) => fromDynamoDB(item as BankInfoDDB)) || [];

      res.json(bankInfo);
    } catch (error) {
      console.error("Error fetching bank info:", error);
      res.status(500).json({ error: "Failed to fetch bank info" });
    }
  }
);

// DELETE BankInfo
bankInfoRoute.delete(
  "/contribute/bankInfo",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Bank info ID is required" });
      }
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#BANKINFO",
          SK: id,
        },
      };
      await documentClient.delete(params);
      res.status(200).json({ message: "Bank info deleted successfully" });
    } catch (error) {
      console.error("Error deleting bank info:", error);
      res.status(500).json({ error: "Failed to delete bank info" });
    }
  }
);
