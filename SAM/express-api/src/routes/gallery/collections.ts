import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Collection,
  CollectionDDB,
  fromDynamoDB,
  isCollectionDDB,
  toDynamoDB,
  validateCollectionDDB,
  validateCollection,
} from "../../models/gallery/collections";

export const collectionsRoute = express.Router();

const COLLECTIONS_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET Collections
collectionsRoute.get(
  "/gallery/collections",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: COLLECTIONS_TABLE,
        IndexName: "entityTypePK",
        KeyConditionExpression: "entityType = :sk",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#GALLERY#COLLECTION",
        },
        //   id is lexagraphically sorted so sort it from old to new
        ScanIndexForward: true,
      });

      const collections = result.Items?.map((item) =>
        fromDynamoDB(item as CollectionDDB)
      );

      res.json(collections);
    } catch (error) {
      console.error("Error fetching Collections:", error);
      res.status(500).json({ error: "Failed to fetch Collections" });
    }
  }
);

// CREATE Collection
collectionsRoute.post(
  "/gallery/collections",
  async (req: Request, res: Response) => {
    try {
      const collection: Collection = req.body;

      if (!validateCollection(collection)) {
        return res.status(400).json({ error: "Invalid collection data" });
      }
      const params = {
        TableName: COLLECTIONS_TABLE,
        Item: toDynamoDB(collection),
      };
      await documentClient.put(params);
      res.status(200).json(collection);
    } catch (error) {
      console.error("Error creating collection:", error);
      res.status(500).json({ error: "Failed to create collection" });
    }
  }
);

// DELETE Collection
collectionsRoute.delete(
  "/gallery/collections",
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const params = {
        TableName: COLLECTIONS_TABLE,
        Key: {
          PK: name,
          SK: name,
        },
      };
      await documentClient.delete(params);
      res.status(200).json({ message: "Collection deleted successfully" });
    } catch (error) {
      console.error("Error deleting collection:", error);
      res.status(500).json({ error: "Failed to delete collection" });
    }
  }
);
