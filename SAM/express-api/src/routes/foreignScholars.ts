import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  ForeignScholar,
  ForeignScholarDDB,
  toDynamoDB,
  fromDynamoDB,
  validateForeignScholar,
} from "../models/foreignScholars";

export const foreignScholarRoute = express.Router();

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// CREATE Foreign Scholar
foreignScholarRoute.post(
  "/foreign-scholars",
  async (req: Request, res: Response) => {
    try {
      const scholarData: ForeignScholar = req.body;

      // Validate scholar data
      if (!validateForeignScholar(scholarData)) {
        return res.status(400).json({
          error:
            "Invalid scholar data. Ensure name, id and description are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(scholarData);

      // Put item in DynamoDB
      await documentClient.put({
        TableName: TABLE_NAME,
        Item: dynamoDBItem,
      });
      res.status(201).json(scholarData);
    } catch (error) {
      console.error("Error creating scholar:", error);
      res.status(500).json({ error: "Failed to create scholar" });
    }
  }
);

// GET all foreign scholars
foreignScholarRoute.get(
  "/foreign-scholars",
  async (req: Request, res: Response) => {
    try {
      const params = {
        TableName: TABLE_NAME,
        FilterExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#FOREIGN_SCHOLAR",
        },
        IndexName: "entityTypePK",
      };

      const { Items } = await documentClient.query(params);

      const scholars =
        Items?.map((item) => fromDynamoDB(item as ForeignScholarDDB)) || [];

      res.json(scholars);
    } catch (error) {
      console.error("Error fetching scholars:", error);
      res.status(500).json({ error: "Failed to fetch scholars" });
    }
  }
);

// DELETE a foreign scholar
foreignScholarRoute.delete(
  "/foreign-scholars",
  async (req: Request, res: Response) => {
    try {
      // id from body
      const { id } = req.body;

      await documentClient.delete({
        TableName: TABLE_NAME,
        Key: {
          PK: id,
          SK: id,
        },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting scholar:", error);
      res.status(500).json({ error: "Failed to delete scholar" });
    }
  }
);

// UPDATE a foreign scholar
foreignScholarRoute.put(
  "/foreign-scholars/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const updatedScholarData: ForeignScholar = req.body;

      // Validate updated scholar data
      if (!validateForeignScholar(updatedScholarData)) {
        return res.status(400).json({
          error:
            "Invalid updated scholar data. Ensure name, id and description are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(updatedScholarData);

      // Update item in DynamoDB
      await documentClient.put({
        TableName: TABLE_NAME,
        Item: dynamoDBItem,
      });

      res.status(200).json(updatedScholarData);
    } catch (error) {
      console.error("Error updating scholar:", error);
      res.status(500).json({ error: "Failed to update scholar" });
    }
  }
);