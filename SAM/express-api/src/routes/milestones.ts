import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";
import {
  Milestone,
  MilestoneDDB,
  fromDynamoDB,
  toDynamoDB,
} from "../models/milestones";

export const milestonesRoute = express.Router();

// GET all milestones
milestonesRoute.get("/milestones", async (req: Request, res: Response) => {
  try {
    const params = {
      TableName: "ksri-prod_admin_master_table",
      KeyConditionExpression: "PK = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#MILESTONE",
      },
      // IndexName: "entityTypeSK",
      // ScanIndexForward: ,
    };

    const { Items } = await documentClient.query(params);

    const milestones =
      Items?.map((item) => fromDynamoDB(item as MilestoneDDB)) || [];

    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
});

// POST create a milestone
milestonesRoute.post(
  "/milestones",
  async (
    req: Request<Record<string, never>, unknown, Milestone>,
    res: Response
  ) => {
    try {
      const milestone: Milestone = req.body;
      const dynamoDBItem = toDynamoDB(milestone);

      await documentClient.put({
        TableName: "ksri-prod_admin_master_table",
        Item: dynamoDBItem,
      });
      res.status(200).json(milestone);
    } catch (error) {
      console.error("Error creating milestone:", error);
      res.status(500).json({ error: "Failed to create milestone" });
    }
  }
);

// DELETE a milestone
milestonesRoute.delete(
  "/milestones",
  async (req: Request<{ title: string; year: string }>, res: Response) => {
    try {
      const { id } = req.body;

      // Create the same PK as in the toDynamoDB function
      // const pk = title;
      // .toLowerCase()
      // .replace(/[^a-z0-9]+/g, "-")
      // .replace(/(^-|-$)/g, "");
      // const sk = `${year}`;

      await documentClient.delete({
        TableName: "ksri-prod_admin_master_table",
        Key: {
          PK: "ENTITYTYPE#MILESTONE",
          SK: id,
        },
      });

      res.status(200).send();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      res.status(500).json({ error: "Failed to delete milestone" });
    }
  }
);
