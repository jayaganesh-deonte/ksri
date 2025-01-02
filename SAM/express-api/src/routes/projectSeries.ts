import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  ProjectSeries,
  ProjectSeriesDDB,
  fromDynamoDB,
  toDynamoDB,
  validateProjectSeries,
} from "../models/projectSeries";

export const projectSeriesRoute = Router();
const PROJECTS_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri-prod_admin_master_table";

// GET all project series
projectSeriesRoute.get(
  "/project/series",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: PROJECTS_TABLE,
        IndexName: "entityTypeSK",
        KeyConditionExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#PROJECTSERIES",
        },
        //   id is lexagraphically sorted so sort
        ScanIndexForward: false,
      });

      const projectSeries =
        result.Items &&
        result.Items.map((item) => fromDynamoDB(item as ProjectSeriesDDB));

      res.status(200).json(projectSeries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//  CREATE project series
projectSeriesRoute.post(
  "/project/series",
  async (req: Request, res: Response) => {
    try {
      const projectSeriesData: ProjectSeries = req.body;

      // Validate project series data
      if (!validateProjectSeries(projectSeriesData)) {
        return res.status(400).json({ error: "Invalid project series data" });
      }

      // Convert to DynamoDB format
      const projectSeriesDDB: ProjectSeriesDDB = toDynamoDB(projectSeriesData);
      // Save to DynamoDB
      await documentClient.put({
        TableName: PROJECTS_TABLE,
        Item: projectSeriesDDB,
      });
      res.status(200).json(projectSeriesData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// DELETE project series
projectSeriesRoute.delete(
  "/project/series",
  async (req: Request, res: Response) => {
    try {
      const { id, name } = req.body;
      // Delete item from DynamoDB
      await documentClient.delete({
        TableName: PROJECTS_TABLE,
        Key: {
          PK: name,
          SK: id,
        },
        ConditionExpression: "attribute_exists(PK)", // Ensure project exists
      });
      res.status(200).json({ message: "Project series deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
