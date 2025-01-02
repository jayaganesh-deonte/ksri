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

const ARTICLES_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri-prod_admin_master_table";

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
    // Get pagination parameters from query string
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const lastEvaluatedKey = req.query.lastEvaluatedKey
      ? JSON.parse(decodeURIComponent(req.query.lastEvaluatedKey as string))
      : undefined;

    // query table using GSI
    const result = await documentClient.query({
      TableName: ARTICLES_TABLE,
      // IndexName: "entityTypeSK",
      KeyConditionExpression: "PK = :sk",
      ExpressionAttributeValues: {
        ":sk": "ENTITYTYPE#ARTICLE",
      },
      ScanIndexForward: false,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const articles = result.Items?.map((item) =>
      fromDynamoDB(item as ArticleDDB)
    );

    // Return articles and pagination token if more results exist
    res.json({
      data: articles,
      lastEvaluatedKey: result.LastEvaluatedKey
        ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
        : null,
      count: articles?.length || 0,
    });
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
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Article ID is required" });
      }

      const params = {
        TableName: ARTICLES_TABLE,
        Key: {
          PK: "ENTITYTYPE#ARTICLE",
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
