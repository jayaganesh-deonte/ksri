import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";
import {
  Project,
  ProjectDDB,
  toDynamoDB,
  fromDynamoDB,
  validateProject,
} from "../models/projects"; // Assuming you'll create this file
import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";

const projectRoute = Router();

// CREATE Project
projectRoute.post("/projects", async (req: Request, res: Response) => {
  try {
    const projectData: Project = req.body;
    // Validate project data
    if (!validateProject(projectData)) {
      return res.status(400).json({
        error: "Invalid project data. Ensure all required fields are present.",
      });
    }

    // Convert to DynamoDB format
    const projectDDB = toDynamoDB(projectData);
    // Put item in DynamoDB
    try {
      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: projectDDB,
      });
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

// GET ALL Projects
projectRoute.get("/projects", async (req: Request, res: Response) => {
  try {
    // Extract optional query parameters for filtering
    const { status } = req.query;

    // Prepare query parameters
    // if status is present in endpoint, query GSI PKStatus PK => ENTITYTYPE#PROJECT and projectStatus = status
    let result: QueryCommandOutput;
    if (status) {
      result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        IndexName: "PkProjectStatus",
        KeyConditionExpression: "PK = :sk AND #status = :status",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#PROJECT",
          ":status": status,
        },
        ExpressionAttributeNames: {
          "#status": "status",
        },
        //   id is lexagraphically sorted so sort it
        ScanIndexForward: false,
      });
    } else {
      result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        KeyConditionExpression: "PK = :sk",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#PROJECT",
        },
        //   id is lexagraphically sorted so sort it from old to new
        ScanIndexForward: true,
      });
    }

    const projects = result.Items?.map((item) =>
      fromDynamoDB(item as ProjectDDB)
    );
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      error: "Failed to fetch projects",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE Project
projectRoute.delete("/projects", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Delete item from DynamoDB
    try {
      const deleteQuery = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#PROJECT",
          SK: id,
        },
        ConditionExpression: "attribute_exists(PK)", // Ensure project exists
      };

      await documentClient.delete(deleteQuery);
      res.status(200).json({
        message: "Project deleted successfully",
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
