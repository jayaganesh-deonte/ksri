import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";

export const visitorCountRoute = Router();

visitorCountRoute.post(
  "/public/visitorCount",
  async (req: Request, res: Response) => {
    try {
      const item = {
        PK: "ENTITYTYPE#WEBSITE#VISITORCOUNT",
        SK: "ENTITYTYPE#WEBSITE#VISITORCOUNT",
      };
      // update visitor count in DDB, creating the attribute if it doesn't exist
      await documentClient.update({
        TableName: process.env.DDB_TABLE_NAME,
        Key: item,
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
      console.error(error);
      res.status(500).send(error);
    }
  }
);

// get visitor count
visitorCountRoute.get(
  "/public/visitorCount",
  async (req: Request, res: Response) => {
    try {
      const item = {
        PK: "ENTITYTYPE#WEBSITE#VISITORCOUNT",
        SK: "ENTITYTYPE#WEBSITE#VISITORCOUNT",
      };

      const result = await documentClient.get({
        TableName: process.env.DDB_TABLE_NAME,
        Key: item,
      });

      if (result.Item) {
        res.status(200).json({ visitorCount: result.Item.visitorCount });
      } else {
        res.status(404).json({ message: "Visitor count not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
);
