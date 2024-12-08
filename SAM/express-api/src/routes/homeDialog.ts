import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  HomeDialog,
  HomeDialogDDB,
  fromDynamoDB,
  toDynamoDB,
} from "../models/homeDialog";

export const homeDialogRouter = express.Router();

const HOMEDIALOG_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET Home Dialog

homeDialogRouter.get("/homedialog", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: HOMEDIALOG_TABLE,
      IndexName: "entityTypePK",
      KeyConditionExpression: "entityType = :sk",
      ExpressionAttributeValues: {
        ":sk": "ENTITYTYPE#HOMEDIALOG",
      },
      //   id is lexagraphically sorted so sort it from old to new
      ScanIndexForward: true,
    });

    const homeDialogs =
      result.Items &&
      result.Items.map((item) => fromDynamoDB(item as HomeDialogDDB));

    res.status(200).json(homeDialogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST Home Dialog
homeDialogRouter.post("/homedialog", async (req: Request, res: Response) => {
  try {
    const homeDialog: HomeDialog = req.body;
    const homeDialogDDB: HomeDialogDDB = toDynamoDB(homeDialog);
    await documentClient.put({
      TableName: HOMEDIALOG_TABLE,
      Item: homeDialogDDB,
    });
    res.status(201).json(homeDialog);
  } catch (error) {
    console.error("Error creating home dialog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE Home Dialog
homeDialogRouter.delete("/homedialog", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const params = {
      TableName: HOMEDIALOG_TABLE,
      Key: {
        PK: id,
        SK: id,
      },
    };
    await documentClient.delete(params);
    res.status(200).json({ message: "Home Dialog deleted successfully" });
  } catch (error) {
    console.error("Error deleting home dialog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
