import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";
import {
  Project,
  ProjectDDB,
  toDynamoDB,
  fromDynamoDB,
  validateProject,
} from "../models/projects"; // Assuming you'll create this file
import { PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const projectRoute = Router();

const PROJECTS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// CREATE Project
projectRoute.post("/projects", async (req: Request, res: Response) => {
  try {
    const projectData: Partial<Project> = req.body;
    // Validate project data
    if (!validateProject(projectData)) {
      return res.status(400).json({
        error: "Invalid project data. Ensure all required fields are present.",
      });
    }

    // Convert to DynamoDB format
    const projectDDB = toDynamoDB(projectData as Project);
    // Put item in DynamoDB
    const command = new PutCommand({
      TableName: PROJECTS_TABLE,
      Item: projectDDB,
      ConditionExpression: "attribute_not_exists(PK)", // Prevent overwriting
    });

    try {
      await documentClient.send(command);
      res.status(200).json(projectData);
    } catch (err) {
      if (
        err instanceof Error &&
        err.name === "ConditionalCheckFailedException"
      ) {
        return res.status(400).json({
          error: "A project with this title already exists.",
        });
      }
      throw err;
    }
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      error: "Failed to create project",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// UPDATE Project
projectRoute.put("/projects", async (req: Request, res: Response) => {
  try {
    const projectData: Partial<Project> = req.body;

    // Validate project data
    if (!validateProject(projectData)) {
      return res.status(400).json({
        error: "Invalid project data. Ensure all required fields are present.",
      });
    }

    // Convert to DynamoDB format
    const projectDDB = toDynamoDB(projectData as Project);

    // Update item in DynamoDB
    const command = new PutCommand({
      TableName: PROJECTS_TABLE,
      Item: projectDDB,
      ConditionExpression: "attribute_exists(PK)", // Ensure project exists
    });

    await documentClient.send(command);
    res.status(200).json(projectData);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      error: "Failed to update project",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET ALL Projects
projectRoute.get("/projects", async (req: Request, res: Response) => {
  try {
    // Extract optional query parameters for filtering
    const { status } = req.query;

    // Prepare query parameters
    const queryParams: any = {
      TableName: PROJECTS_TABLE,
      KeyConditionExpression: "entityType = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#PROJECT",
      },
      // use GSI entityTypePK
      IndexName: "entityTypePK",
    };

    // Add optional status filter
    if (status) {
      queryParams.FilterExpression = "#statusAttr = :status";
      queryParams.ExpressionAttributeNames = {
        "#statusAttr": "status",
      };
      queryParams.ExpressionAttributeValues[":status"] = status;
    }

    // Execute query
    const command = new QueryCommand(queryParams);
    const { Items } = await documentClient.send(command);

    const projects =
      Items?.map((item) => fromDynamoDB(item as ProjectDDB)) || [];

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      error: "Failed to fetch projects",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE Project
projectRoute.delete("/projects/:title", async (req: Request, res: Response) => {
  try {
    const { title } = req.params;

    // Create a URL-friendly version of the title (same as in toDynamoDB)
    const pk = title;

    // Prepare delete command
    const command = new DeleteCommand({
      TableName: PROJECTS_TABLE,
      Key: {
        PK: pk,
        SK: `PROJECT`, // You might need to handle this dynamically
      },
      ConditionExpression: "attribute_exists(PK)", // Ensure project exists
    });

    try {
      await documentClient.send(command);
      res.status(200).json({
        message: "Project deleted successfully",
        title: title,
      });
    } catch (err) {
      if (
        err instanceof Error &&
        err.name === "ConditionalCheckFailedException"
      ) {
        return res.status(404).json({
          error: "Project not found",
        });
      }
      throw err;
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      error: "Failed to delete project",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export { projectRoute };
