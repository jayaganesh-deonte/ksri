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

const TRADITIONAL_SCHOLARS_TABLE = "ksri_admin_master_table";

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
        TableName: TRADITIONAL_SCHOLARS_TABLE,
        Item: scholarDDB,
        ConditionExpression: "attribute_not_exists(PK)", // Prevent overwriting
      });

      try {
        await documentClient.send(command);
        res.status(201).json(scholarData);
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
        TableName: TRADITIONAL_SCHOLARS_TABLE,
        KeyConditionExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#TRADITIONAL_SCHOLAR",
        },
        // use GSI entityTypePK
        IndexName: "entityTypePK",
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

// UPDATE Traditional Scholar
traditionalScholarRoute.put(
  "/traditional-scholars",
  async (req: Request, res: Response) => {
    try {
      // get name and description from body
      const updateData: Partial<TraditionalScholar> = req.body;

      // Validate update data
      if (
        !validateTraditionalScholar({
          name: updateData.name,
          description: updateData.description || "",
          year: updateData.year,
        })
      ) {
        return res.status(400).json({
          error:
            "Invalid scholar data. Ensure name and description are present.",
        });
      }

      // Prepare update command
      const updateExpression: string[] = [];
      const expressionAttributeValues: Record<string, any> = {};
      const expressionAttributeNames: Record<string, string> = {};

      if (updateData.description) {
        updateExpression.push("#desc = :description");
        expressionAttributeValues[":description"] = updateData.description;
        expressionAttributeNames["#desc"] = "description";
      }

      if (updateData.year !== undefined) {
        updateExpression.push("#yr = :year");
        expressionAttributeValues[":year"] = updateData.year;
        expressionAttributeNames["#yr"] = "year";
      }

      if (updateData.type !== undefined) {
        updateExpression.push("#type = :type");
        expressionAttributeValues[":type"] = updateData.type;
        expressionAttributeNames["#type"] = "type";
      }

      const command = new UpdateCommand({
        TableName: TRADITIONAL_SCHOLARS_TABLE,
        Key: {
          PK: updateData.name,
          SK: updateData.id,
        },
        UpdateExpression: `SET ${updateExpression.join(", ")}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ConditionExpression: "attribute_exists(PK)",
        ReturnValues: "ALL_NEW",
      });

      try {
        const { Attributes } = await documentClient.send(command);

        if (!Attributes) {
          return res.status(404).json({
            error: "Traditional scholar not found",
          });
        }

        // Convert to application model
        const updatedScholar = fromDynamoDB(
          Attributes as TraditionalScholarDDB
        );
        res.json(updatedScholar);
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
      console.error("Error updating traditional scholar:", error);
      res.status(500).json({
        error: "Failed to update traditional scholar",
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
      const pk = req.body.name;

      // Prepare delete command
      const command = new DeleteCommand({
        TableName: TRADITIONAL_SCHOLARS_TABLE,
        Key: {
          PK: pk,
          SK: id,
        },
        ConditionExpression: "attribute_exists(PK)", // Ensure scholar exists
      });

      try {
        await documentClient.send(command);
        res.status(200).json({
          message: "Traditional scholar deleted successfully",
          name: pk,
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
