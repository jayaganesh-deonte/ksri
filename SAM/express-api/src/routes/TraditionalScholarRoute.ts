import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";
import {
  TraditionalScholar,
  TraditionalScholarDDB,
  toDynamoDB,
  fromDynamoDB,
  validateTraditionalScholar,
} from "../models/traditionalScholars";
import {
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const traditionalScholarRoute = Router();

// CREATE Traditional Scholar
traditionalScholarRoute.post(
  "/traditional-scholars",
  async (req: Request, res: Response) => {
    try {
      const scholarData: Partial<TraditionalScholar> = req.body;

      // Validate scholar data
      if (!validateTraditionalScholar(scholarData)) {
        return res.status(400).json({
          error:
            "Invalid scholar data. Ensure name and description are present.",
        });
      }

      // Convert to DynamoDB format
      const scholarDDB = toDynamoDB(scholarData);

      // Put item in DynamoDB
      const command = new PutCommand({
        TableName: process.env.DDB_TABLE_NAME,
        Item: scholarDDB,
      });

      try {
        await documentClient.send(command);
        res.status(200).json(scholarData);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "ConditionalCheckFailedException"
        ) {
          return res.status(409).json({
            error: "A traditional scholar with this name already exists.",
          });
        }
        throw err;
      }
    } catch (error) {
      console.error("Error creating traditional scholar:", error);
      res.status(500).json({
        error: "Failed to create traditional scholar",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// GET ALL Traditional Scholars
traditionalScholarRoute.get(
  "/traditional-scholars",
  async (req: Request, res: Response) => {
    try {
      // Prepare query parameters
      const queryParams = {
        TableName: process.env.DDB_TABLE_NAME,
        KeyConditionExpression: "PK = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#TRADITIONAL_SCHOLAR",
        },
        // use GSI entityTypeSK
        // IndexName: "entityTypeSK",
        ScanIndexForward: false,
      };

      // Execute query
      const command = new QueryCommand(queryParams);
      const { Items } = await documentClient.send(command);

      // Convert DynamoDB items to application model
      const scholars: TraditionalScholar[] = Items
        ? Items.filter(
            (item) => item.entityType === "ENTITYTYPE#TRADITIONAL_SCHOLAR"
          ).map((item) => fromDynamoDB(item as TraditionalScholarDDB))
        : [];

      res.json(scholars);
    } catch (error) {
      console.error("Error fetching traditional scholars:", error);
      res.status(500).json({
        error: "Failed to fetch traditional scholars",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// DELETE Traditional Scholar
traditionalScholarRoute.delete(
  "/traditional-scholars",
  async (req: Request, res: Response) => {
    try {
      // get id from body
      const id = req.body.id;

      // Create a URL-friendly version of the name
      // const pk = req.body.name;

      // Prepare delete command
      const command = new DeleteCommand({
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#TRADITIONAL_SCHOLAR",
          SK: id,
        },
        ConditionExpression: "attribute_exists(PK)", // Ensure scholar exists
      });

      try {
        await documentClient.send(command);
        res.status(200).json({
          message: "Traditional scholar deleted successfully",
          // name: id,
        });
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "ConditionalCheckFailedException"
        ) {
          return res.status(404).json({
            error: "Traditional scholar not found",
          });
        }
        throw err;
      }
    } catch (error) {
      console.error("Error deleting traditional scholar:", error);
      res.status(500).json({
        error: "Failed to delete traditional scholar",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export { traditionalScholarRoute };
