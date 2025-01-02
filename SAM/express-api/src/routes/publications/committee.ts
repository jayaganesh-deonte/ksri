import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  CommitteeMember,
  CommitteeMemberDDB,
  fromDynamoDB,
  isCommitteeMemberDDB,
  toDynamoDB,
  validateCommitteeMember,
} from "../../models/publications/committee";

export const publicationsCommitteeRouter = express.Router();

const COMMITTEE_MEMBERS_TABLE =
  process.env.DDB_TABLE_NAME || "ksri-prod_admin_master_table";

// GET CommitteeMembers
publicationsCommitteeRouter.get(
  "/publications/committee-members",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: COMMITTEE_MEMBERS_TABLE,
        // IndexName: "entityTypeSK",
        ScanIndexForward: false,
        KeyConditionExpression: "PK = :sk",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#PUBLICATION#COMMITTEEMEMBER",
        },
      });

      const committeeMembers = result.Items?.map((item) =>
        fromDynamoDB(item as CommitteeMemberDDB)
      );

      res.json(committeeMembers);
    } catch (error) {
      console.error("Error fetching CommitteeMembers:", error);
      res.status(500).json({ error: "Failed to fetch CommitteeMembers" });
    }
  }
);

// CREATE a CommitteeMember
publicationsCommitteeRouter.post(
  "/publications/committee-members",
  async (req: Request, res: Response) => {
    try {
      const committeeMember: CommitteeMember = req.body;

      if (!validateCommitteeMember(committeeMember)) {
        return res.status(400).json({
          error:
            "Invalid CommitteeMember data. Ensure all required fields are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBCommitteeMember = toDynamoDB(committeeMember);

      // Create item in DynamoDB
      await documentClient.put({
        TableName: COMMITTEE_MEMBERS_TABLE,
        Item: dynamoDBCommitteeMember,
      });
      res.status(200).json(committeeMember);
    } catch (error) {
      console.error("Error creating CommitteeMember:", error);
      res.status(500).json({ error: "Failed to create CommitteeMember" });
    }
  }
);

// DELETE a CommitteeMember
publicationsCommitteeRouter.delete(
  "/publications/committee-members",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          error:
            "Invalid CommitteeMember data. Ensure all required fields are present.",
        });
      }

      // Delete item in DynamoDB
      await documentClient.delete({
        TableName: COMMITTEE_MEMBERS_TABLE,
        Key: {
          PK: "ENTITYTYPE#PUBLICATION#COMMITTEEMEMBER",
          SK: id,
        },
      });

      res.status(200).json({ message: "CommitteeMember deleted successfully" });
    } catch (error) {
      console.error("Error deleting CommitteeMember:", error);
      res.status(500).json({ error: "Failed to delete CommitteeMember" });
    }
  }
);
