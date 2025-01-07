import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Book,
  BookDDB,
  fromDynamoDB,
  isBook,
  toDynamoDB,
  validateBook,
} from "../../models/publications/book";
import { QueryCommandOutput } from "@aws-sdk/client-dynamodb";

export const publicationBookRoute = express.Router();

// CREATE Book
publicationBookRoute.post(
  "/publications/books",
  async (req: Request, res: Response) => {
    try {
      const bookData: Book = req.body;
      console.log(bookData);

      // Validate book data
      if (!validateBook(bookData)) {
        return res.status(400).json({
          error: "Invalid book data. Ensure all required fields are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(bookData);

      // Put item in DynamoDB
      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: dynamoDBItem,
      });

      res.status(200).json({ message: "Book created successfully." });
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ error: "Failed to create book." });
    }
  }
);

// GET all books with option query param as publication type
publicationBookRoute.get(
  "/publications/books",
  async (req: Request, res: Response) => {
    try {
      const { publication } = req.query;
      let result: QueryCommandOutput;

      if (!publication) {
        // query table using GSI
        result = await documentClient.query({
          TableName: process.env.DDB_TABLE_NAME,
          // IndexName: "entityTypeSK",
          ScanIndexForward: false,
          KeyConditionExpression: "PK = :sk",
          ExpressionAttributeValues: {
            ":sk": "ENTITYTYPE#BOOK",
          },
        });
      } else {
        // query GSI entityTypePK entityType => ENTITYTYPE#BOOK and PK = publication
        result = await documentClient.query({
          TableName: process.env.DDB_TABLE_NAME,
          KeyConditionExpression: "PK = :pk",
          ExpressionAttributeValues: {
            ":pk": "ENTITYTYPE#BOOK",
            ":publication": publication,
          },
          // filter
          FilterExpression: "publication = :publication",
        });
      }

      const books = result.Items?.map((item) => {
        // if (isBook(item)) {
        return fromDynamoDB(item as any);
        // }
      });

      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Failed to fetch books." });
    }
  }
);

// DELETE a book
publicationBookRoute.delete(
  "/publications/books",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#BOOK",
          SK: id,
        },
      };

      await documentClient.delete(params);

      res.status(200).json({ message: "Book deleted successfully." });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ error: "Failed to delete book." });
    }
  }
);
