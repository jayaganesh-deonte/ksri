import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Journal,
  JournalDDB,
  toDynamoDB as toDynamoDBJournal,
  fromDynamoDB as fromDynamoDBJournal,
  validateJournalDDB,
  validateJournal,
  isJournalDDB,
} from "../../models/publications/journals";

import { QueryCommandOutput } from "@aws-sdk/client-dynamodb";

export const publicationJournalRoute = express.Router();

// CREATE Journal
publicationJournalRoute.post(
  "/publications/journals",
  async (req: Request, res: Response) => {
    try {
      const journalData: Journal = req.body;
      if (!validateJournal(journalData)) {
        return res.status(400).json({ error: "Invalid journal data" });
      }
      const journalDDB: JournalDDB = toDynamoDBJournal(journalData);
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: journalDDB,
      };
      await documentClient.put(params);
      res.status(200).json(journalData);
    } catch (error) {
      console.error("Error creating journal:", error);
      res.status(500).json({ error: "Failed to create journal" });
    }
  }
);

// DELETE a journal
publicationJournalRoute.delete(
  "/publications/journals",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Journal ID is required" });
      }
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#PUBLICATION#JOURNAL",
          SK: id,
        },
      };
      await documentClient.delete(params);
      res.status(200).json({ message: "Journal deleted successfully" });
    } catch (error) {
      console.error("Error deleting journal:", error);
      res.status(500).json({ error: "Failed to delete journal" });
    }
  }
);

// GET Journals
publicationJournalRoute.get(
  "/publications/journals",
  async (req: Request, res: Response) => {
    try {
      const { publication } = req.query;
      let result: QueryCommandOutput;

      if (!publication) {
        // query table using GSI
        result = await documentClient.query({
          TableName: process.env.DDB_TABLE_NAME,
          // IndexName: "entityTypeSK",
          ScanIndexForward: false,
          KeyConditionExpression: "PK = :sk",
          ExpressionAttributeValues: {
            ":sk": "ENTITYTYPE#PUBLICATION#JOURNAL",
          },
        });
      } else {
        // query GSI entityTypePK entityType => ENTITYTYPE#BOOK and PK = publication
        result = await documentClient.query({
          TableName: process.env.DDB_TABLE_NAME,
          // IndexName: "entityTypePK",
          KeyConditionExpression: "PK = :pk",
          ExpressionAttributeValues: {
            ":pk": "ENTITYTYPE#PUBLICATION#JOURNAL",
            ":publication": publication,
          },
          // filter
          FilterExpression: "publication = :publication",
        });
      }

      const journals = result.Items?.map((item) => {
        // if (isBook(item)) {
        return fromDynamoDBJournal(item as any);
        // }
      });

      res.json(journals);
    } catch (error) {
      console.error("Error fetching journals:", error);
      res.status(500).json({ error: "Failed to fetch journals." });
    }
  }
);
