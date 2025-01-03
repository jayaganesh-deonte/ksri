import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

export const dashboardRoute = express.Router();

// GET Dashboard
dashboardRoute.get("/dashboard", async (req: Request, res: Response) => {
  // get item with PK and SK => ENTITYTYPE#DASHBOARD
  try {
    const result = await documentClient.get({
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#DASHBOARD",
        SK: "ENTITYTYPE#DASHBOARD",
      },
    });
    const item = result.Item || {};
    const data = item.data || {};

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
