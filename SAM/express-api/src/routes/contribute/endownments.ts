import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Endownment,
  EndownmentDDB,
  toDynamoDB,
  fromDynamoDB,
  validateEndownment,
} from "../../models/contribute/endownments";

export const endownmentRoute = express.Router();

// CREATE Endownment
endownmentRoute.post(
  "/contribute/endownments",
  async (req: Request, res: Response) => {
    try {
      const endownmentData: Endownment = req.body;

      // Validate endownment data
      if (!validateEndownment(endownmentData)) {
        return res.status(400).json({
          error:
            "Invalid endownment data. Ensure title, initiatedBy and topic are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(endownmentData);

      // Put item in DynamoDB
      await documentClient.put({
        TableName: "ksri_admin_master_table",
        Item: dynamoDBItem,
      });

      res.status(201).json(endownmentData);
    } catch (error) {
      console.error("Error creating endownment:", error);
      res.status(500).json({ error: "Failed to create endownment" });
    }
  }
);

//  GET all endownments
endownmentRoute.get(
  "/contribute/endownments",
  async (req: Request, res: Response) => {
    try {
      const params = {
        TableName: "ksri_admin_master_table",
        FilterExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#ENDOWNMENT",
        },
        IndexName: "entityTypePK",
      };

      const { Items } = await documentClient.query(params);

      const endownments =
        Items?.map((item) => fromDynamoDB(item as EndownmentDDB)) || [];

      res.json(endownments);
    } catch (error) {
      console.error("Error fetching endownments:", error);
      res.status(500).json({ error: "Failed to fetch endownments" });
    }
  }
);

// UPDATE Endownment
endownmentRoute.put(
  "/contribute/endownments",
  async (req: Request, res: Response) => {
    try {
      const endownmentData: Endownment = req.body;

      // Validate endownment data
      if (!validateEndownment(endownmentData)) {
        return res.status(400).json({
          error:
            "Invalid endownment data. Ensure title, initiatedBy and topic are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(endownmentData);

      // Update item in DynamoDB
      await documentClient.put({
        TableName: "ksri_admin_master_table",
        Item: dynamoDBItem,
      });
      res.status(200).json(endownmentData);
    } catch (error) {
      console.error("Error updating endownment:", error);
      res.status(500).json({ error: "Failed to update endownment" });
    }
  }
);

// DELETE Endownment
endownmentRoute.delete(
  "/contribute/endownments",
  async (req: Request, res: Response) => {
    try {
      const id = req.body.id;
      const title = req.body.title;

      const params = {
        TableName: "ksri_admin_master_table",
        Key: {
          PK: title,
          SK: id,
        },
      };
      await documentClient.delete(params);

      res.status(200).json({ message: "Endownment deleted successfully" });
    } catch (error) {
      console.error("Error deleting endownment:", error);
      res.status(500).json({ error: "Failed to delete endownment" });
    }
  }
);