import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

export const dashboardRoute = express.Router();

const DASHBOARD_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri-prod_admin_master_table";

// GET Dashboard
dashboardRoute.get("/dashboard", async (req: Request, res: Response) => {
  // get item with PK and SK => ENTITYTYPE#DASHBOARD
  try {
    const result = await documentClient.get({
      TableName: DASHBOARD_TABLE,
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
