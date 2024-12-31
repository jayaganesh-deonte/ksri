import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Article,
  ArticleDDB,
  fromDynamoDB,
  isArticle,
  toDynamoDB,
  validateArticle,
} from "../../models/library/articles";

export const articleRoute = express.Router();

const ARTICLES_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// CREATE Article
articleRoute.post("/library/articles", async (req: Request, res: Response) => {
  try {
    const articleData: Article = req.body;

    // Validate article data
    if (!validateArticle(articleData)) {
      return res.status(400).json({
        error: "Invalid article data. Ensure all required fields are present.",
      });
    }

    // Convert to DynamoDB format
    const dynamoDBItem = toDynamoDB(articleData);

    // convert dynamoDBItem.year to number
    dynamoDBItem.year = Number(dynamoDBItem.year);

    // Put item in DynamoDB
    await documentClient.put({
      TableName: ARTICLES_TABLE,
      Item: dynamoDBItem,
    });

    res.status(200).json(articleData);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ Article
articleRoute.get("/library/articles", async (req: Request, res: Response) => {
  try {
    let items: any[] = [];
    let lastEvaluatedKey = undefined;

    do {
      // query table using GSI
      const result: any = await documentClient.query({
        TableName: ARTICLES_TABLE,
        IndexName: "entityTypeSK",
        KeyConditionExpression: "entityType = :sk",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#ARTICLE",
        },
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false,
      });

      if (result.Items) {
        items = items.concat(result.Items);
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    const articles = items.map((item) => fromDynamoDB(item as ArticleDDB));

    res.json(articles);
  } catch (error) {
    console.error("Error fetching scholars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  DELETE Article
articleRoute.delete(
  "/library/articles",
  async (req: Request, res: Response) => {
    try {
      const { id, title } = req.body;

      if (!id || !title) {
        return res.status(400).json({ error: "Article ID is required" });
      }

      const params = {
        TableName: ARTICLES_TABLE,
        Key: {
          PK: title,
          SK: id,
        },
      };

      await documentClient.delete(params);

      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
