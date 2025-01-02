import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  Supervisor,
  SupervisorDDB,
  toDynamoDB,
  fromDynamoDB,
  validateSupervisor,
  validateSupervisorDDB,
} from "../models/supervisor";

export const supervisorRoute = Router();

const SUPERVISORS_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri-prod_admin_master_table";

// CREATE Supervisor
supervisorRoute.post("/supervisor", async (req: Request, res: Response) => {
  try {
    const supervisorData: Supervisor = req.body;

    // Validate supervisor data
    if (!validateSupervisor(supervisorData)) {
      return res.status(400).json({
        error:
          "Invalid supervisor data. Ensure name and description are present.",
      });
    }

    // Convert to DynamoDB format
    const dynamoDBItem = toDynamoDB(supervisorData);

    // Put item in DynamoDB
    await documentClient.put({
      TableName: SUPERVISORS_TABLE,
      Item: dynamoDBItem,
    });

    res.status(200).json(supervisorData);
  } catch (error) {
    console.error("Error creating supervisor:", error);
    res.status(500).json({ error: "Failed to create supervisor" });
  }
});

// GET all supervisors
supervisorRoute.get("/supervisor", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: SUPERVISORS_TABLE,
      // IndexName: "entityTypeSK",
      ScanIndexForward: false,
      KeyConditionExpression: "PK = :sk",
      ExpressionAttributeValues: {
        ":sk": "ENTITYTYPE#SUPERVISOR",
      },
    });

    const supervisors = result.Items?.map((item) =>
      fromDynamoDB(item as SupervisorDDB)
    );

    res.json(supervisors);
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ error: "Failed to fetch supervisors" });
  }
});

// DELETE a supervisor
supervisorRoute.delete("/supervisor", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Delete item from DynamoDB
    await documentClient.delete({
      TableName: SUPERVISORS_TABLE,
      Key: {
        PK: "ENTITYTYPE#SUPERVISOR",
        SK: id,
      },
    });
    res.status(200).json({ message: "Supervisor deleted successfully" });
  } catch (error) {
    console.error("Error deleting supervisor:", error);
    res.status(500).json({ error: "Failed to delete supervisor" });
  }
});
