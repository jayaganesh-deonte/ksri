import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  News,
  NewsDDB,
  fromDynamoDB,
  toDynamoDB,
  validateNews,
} from "../models/news";

export const newsRoute = express.Router();

const NEWS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET News
newsRoute.get("/news", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: NEWS_TABLE,
      IndexName: "entityTypePK",
      KeyConditionExpression: "entityType = :sk",
      ExpressionAttributeValues: {
        ":sk": "ENTITYTYPE#NEWS",
      },
      //   id is lexagraphically sorted so sort it from old to new
      ScanIndexForward: true,
    });

    const news = result.Items?.map((item) => {
      return fromDynamoDB(item as NewsDDB);
    });

    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// POST News
newsRoute.post("/news", async (req: Request, res: Response) => {
  try {
    const news: News = req.body;

    if (!validateNews(news)) {
      res.status(400).send("Invalid news");
      return;
    }

    const dynamoDBItem = toDynamoDB(news);

    await documentClient.put({
      TableName: NEWS_TABLE,
      Item: dynamoDBItem,
    });

    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// DELETE News
newsRoute.delete("/news", async (req: Request, res: Response) => {
  try {
    const { title, id } = req.body;
    await documentClient.delete({
      TableName: NEWS_TABLE,
      Key: {
        PK: title,
        SK: id,
      },
    });
    res.status(200).send("News deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
