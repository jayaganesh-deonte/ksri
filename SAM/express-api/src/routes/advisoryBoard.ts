import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  AdvisoryBoard,
  AdvisoryMembetDDB,
  fromDynamoDB,
  isCommitteeMemberDDB,
  toDynamoDB,
  validateCommitteeMember,
} from "../models/advisoryBoard";

export const advisoryBoardRouter = express.Router();

// GET CommitteeMembers
advisoryBoardRouter.get(
  "/advisory-board",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        ScanIndexForward: false,
        KeyConditionExpression: "PK = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#ADVISORY_BOARD",
        },
      });
      res.json(
        result.Items?.map((item) => fromDynamoDB(item as AdvisoryMembetDDB))
      );
    } catch (error) {
      console.error("Error fetching AdvisoryBoard:", error);
      res.status(500).json({ error: "Failed to fetch AdvisoryBoard" });
    }
  }
);

// CREATE Advisory Board
advisoryBoardRouter.post(
  "/advisory-board",
  async (req: Request, res: Response) => {
    try {
      const advisoryBoard: AdvisoryBoard = req.body;

      if (!validateCommitteeMember(advisoryBoard)) {
        return res.status(400).json({
          error:
            "Invalid AdvisoryBoard data. Ensure all required fields are present.",
        });
      }

      const advisoryBoardDDB = toDynamoDB(advisoryBoard);

      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: advisoryBoardDDB,
      });

      res.status(200).json(advisoryBoard);
    } catch (error) {
      console.error("Error creating AdvisoryBoard:", error);
      res.status(500).json({ error: "Failed to create AdvisoryBoard" });
    }
  }
);

// DELETE Advisory Board
advisoryBoardRouter.delete(
  "/advisory-board",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      await documentClient.delete({
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#ADVISORY_BOARD",
          SK: id,
        },
      });

      res.status(200).json({ message: "Advisory Board deleted successfully" });
    } catch (error) {
      console.error("Error deleting AdvisoryBoard:", error);
      res.status(500).json({ error: "Failed to delete AdvisoryBoard" });
    }
  }
);
