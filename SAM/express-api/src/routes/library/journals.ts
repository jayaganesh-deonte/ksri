import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Journal,
  JournalDDB,
  toJournalDDB,
  fromJournalDDB,
  isJournal,
  validateJournal,
  isSubJournal,
} from "../../models/library/journals";

export const journalRoute = express.Router();

const JOURNALS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

//  CREATE Journal
journalRoute.post("/library/journals", async (req: Request, res: Response) => {
  try {
    const journalData: Journal = req.body;

    // Validate journal data
    if (!validateJournal(journalData)) {
      console.error("Invalid journal data:", journalData);
      return res.status(400).json({
        error: "Invalid journal data. Ensure all required fields are present.",
      });
    }

    // Convert to DynamoDB format
    const dynamoDBItem = toJournalDDB(journalData);

    // Put item in DynamoDB
    await documentClient.put({
      TableName: JOURNALS_TABLE,
      Item: dynamoDBItem,
    });
    res.status(200).json({ message: "Journal created successfully" });
  } catch (error) {
    console.error("Error creating journal:", error);
    res.status(500).json({ error: "Failed to create journal" });
  }
});

// GET all journals
journalRoute.get("/library/journals", async (req: Request, res: Response) => {
  try {
    const params = {
      TableName: "ksri_admin_master_table",
      KeyConditionExpression: "entityType = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#JOURNAL",
      },
      IndexName: "entityTypeSK",
      ScanIndexForward: false,
    };
    const response = await documentClient.query(params);
    const journals = response.Items?.map((item: any) => fromJournalDDB(item));
    res.json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
});

// DELETE a journal
journalRoute.delete(
  "/library/journals",
  async (req: Request, res: Response) => {
    try {
      const { id, JournalName } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Journal ID is required" });
      }
      const params = {
        TableName: "ksri_admin_master_table",
        Key: {
          PK: JournalName,
          SK: id,
        },
      };
      await documentClient.delete(params);
      res.json({ message: "Journal deleted successfully" });
    } catch (error) {
      console.error("Error deleting journal:", error);
      res.status(500).json({ error: "Failed to delete journal" });
    }
  }
);
