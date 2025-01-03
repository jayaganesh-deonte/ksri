import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  ResearchArticle,
  ResearchArticleDDB,
  toDynamoDB,
  fromDynamoDB,
  validateResearchArticle,
  validateResearchArticleDDB,
} from "../models/researchArticles";

export const researchArticlesRoute = Router();

// CREATE Research Article
researchArticlesRoute.post(
  "/researchArticles",
  async (req: Request, res: Response) => {
    try {
      const researchArticleData: ResearchArticle = req.body;

      // Validate research article data
      if (!validateResearchArticle(researchArticleData)) {
        return res.status(400).json({ error: "Invalid research article data" });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(researchArticleData);
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: dynamoDBItem,
      };
      // Save to DynamoDB
      await documentClient.put(params);

      res.status(200).json(researchArticleData);
    } catch (error) {
      console.error("Error creating research article:", error);
      res.status(500).json({ error: "Failed to create research article" });
    }
  }
);

// GET Research Articles
researchArticlesRoute.get(
  "/researchArticles",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        ScanIndexForward: false,
        KeyConditionExpression: "PK = :sk",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#RESEARCHARTICLE",
        },
      });

      const researchArticles = result.Items?.map((item) =>
        fromDynamoDB(item as ResearchArticleDDB)
      );
      res.json(researchArticles);
    } catch (error) {
      console.error("Error fetching research articles:", error);
      res.status(500).json({ error: "Failed to fetch research articles" });
    }
  }
);

// DELETE a research article
researchArticlesRoute.delete(
  "/researchArticles",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      // Delete item from DynamoDB
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#RESEARCHARTICLE",
          SK: id,
        },
      };
      await documentClient.delete(params);

      res
        .status(200)
        .json({ message: "Research article deleted successfully" });
    } catch (error) {
      console.error("Error deleting research article:", error);
      res.status(500).json({ error: "Failed to delete research article" });
    }
  }
);
