import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";

export const uniqueVisitorsRoute = Router();

uniqueVisitorsRoute.get(
  "/public/uniqueVisitors",
  async (req: Request, res: Response) => {
    try {
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#WEBSITE#UNIQUEVISITORS#COUNT",
          SK: "ENTITYTYPE#WEBSITE#UNIQUEVISITORS#COUNT",
        },
      };
      const result = await documentClient.get(params);
      const item = result.Item || {};
      const visitorCount = item.visitorCount || 0;

      res.status(200).json({ visitorCount });
    } catch (error) {
      console.error("Error getting unique visitors:", error);
      res.status(500).json({
        error: "Failed to get unique visitors",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

uniqueVisitorsRoute.post(
  "/public/uniqueVisitors",
  async (req: Request, res: Response) => {
    try {
      const item = {
        PK: "ENTITYTYPE#WEBSITE#UNIQUEVISITORS",
        SK: "ENTITYTYPE#WEBSITE#UNIQUEVISITORS",
        ...req.body,
      };
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: item,
      };
      await documentClient.put(params);

      //   increment unique visitors count
      const param2 = {
        PK: "ENTITYTYPE#WEBSITE#UNIQUEVISITORS#COUNT",
        SK: "ENTITYTYPE#WEBSITE#UNIQUEVISITORS#COUNT",
      };
      // update visitor count in DDB, creating the attribute if it doesn't exist
      await documentClient.update({
        TableName: process.env.DDB_TABLE_NAME,
        Key: param2,
        UpdateExpression:
          "SET visitorCount = if_not_exists(visitorCount, :zero) + :val",
        ExpressionAttributeValues: {
          ":val": 1,
          ":zero": 0,
        },
        ReturnValues: "UPDATED_NEW",
      });

      res.status(200).json({ message: "Visitor count updated successfully" });
    } catch (error) {
      console.error("Error getting unique visitors:", error);
      res.status(500).json({
        error: "Failed to post unique visitors",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
