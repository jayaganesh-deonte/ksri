import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  HomeDialog,
  HomeDialogDDB,
  fromDynamoDB,
  toDynamoDB,
} from "../models/homeDialog";

export const homeDialogRouter = express.Router();

// GET Home Dialog

homeDialogRouter.get("/homedialog", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: process.env.DDB_TABLE_NAME,
      // IndexName: "entityTypeSK",
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": "ENTITYTYPE#HOMEDIALOG",
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
      TableName: process.env.DDB_TABLE_NAME,
      Item: homeDialogDDB,
    });
    res.status(200).json(homeDialog);
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
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#HOMEDIALOG",
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

// public route /public/homedialog
homeDialogRouter.get(
  "/public/homedialog",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",

        KeyConditionExpression: "PK = :PK",
        ExpressionAttributeValues: {
          ":PK": "ENTITYTYPE#HOMEDIALOG",
          ":status": "PUBLISHED",
        },
        //   id is lexagraphically sorted so sort it from old to new
        ScanIndexForward: false,

        // filter only status published
        FilterExpression: "itemPublishStatus = :status",
      });

      const homeDialogs =
        result.Items &&
        result.Items.map((item) => fromDynamoDB(item as HomeDialogDDB));

      res.status(200).json(homeDialogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
