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

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

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
        TableName: TABLE_NAME,
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
        TableName: TABLE_NAME,
        KeyConditionExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#BANKINFO",
        },
        IndexName: "entityTypePK",
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
      const { id, name } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Bank info ID is required" });
      }
      if (!name) {
        return res.status(400).json({ error: "Bank info name is required" });
      }
      const params = {
        TableName: TABLE_NAME,
        Key: {
          PK: name,
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