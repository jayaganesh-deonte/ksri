import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  AdditionalPublication,
  AdditionalPublicationDDB,
  fromDynamoDB,
  toDynamoDB,
  validateAdditionalPublication,
  validateAdditionalPublicationDDB,
} from "../../models/publications/additionalPublications";

export const additionalPublicationsRoute = express.Router();

// CREATE Additional Publication
additionalPublicationsRoute.post(
  "/publications/additionalPublications",
  async (req: Request, res: Response) => {
    try {
      const additionalPublicationData: AdditionalPublication = req.body;

      // Validate additional publication data
      if (!validateAdditionalPublication(additionalPublicationData)) {
        return res.status(400).json({
          error:
            "Invalid additional publication data. Ensure all required fields are present.",
        });
      }

      // Convert to DynamoDB format
      const additionalPublicationDDB: AdditionalPublicationDDB = toDynamoDB(
        additionalPublicationData
      );

      // Put item in DynamoDB
      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: additionalPublicationDDB,
      });

      res
        .status(200)
        .json({ message: "Additional publication created successfully." });
    } catch (error) {
      console.error("Error creating additional publication:", error);
      res
        .status(500)
        .json({ error: "Failed to create additional publication." });
    }
  }
);

// GET Additional Publications
additionalPublicationsRoute.get(
  "/publications/additionalPublications",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        KeyConditionExpression: "PK = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#ADDITIONALPUBLICATION",
        },
        ScanIndexForward: false,
      });

      res.json(
        result.Items?.map((item) => {
          if (validateAdditionalPublicationDDB(item as any)) {
            return fromDynamoDB(item as any);
          }
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// DELETE Additional Publication
additionalPublicationsRoute.delete(
  "/publications/additionalPublications",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#ADDITIONALPUBLICATION",
          SK: id,
        },
      };
      await documentClient.delete(params);
      res.status(200).json({ message: "Additional publication deleted." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to delete additional publication." });
    }
  }
);
