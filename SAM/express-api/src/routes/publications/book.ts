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

const BOOKS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// CREATE Book
publicationBookRoute.post(
  "/publications/books",
  async (req: Request, res: Response) => {
    try {
      const bookData: Book = req.body;

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
        TableName: BOOKS_TABLE,
        Item: dynamoDBItem,
      });

      res.status(201).json({ message: "Book created successfully." });
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
          TableName: BOOKS_TABLE,
          IndexName: "entityTypePK",
          KeyConditionExpression: "entityType = :sk",
          ExpressionAttributeValues: {
            ":sk": "ENTITYTYPE#BOOK",
          },
        });
      } else {
        // query GSI entityTypePK entityType => ENTITYTYPE#BOOK and PK = publication
        result = await documentClient.query({
          TableName: BOOKS_TABLE,
          IndexName: "entityTypePK",
          KeyConditionExpression: "entityType = :sk AND PK = :pk",
          ExpressionAttributeValues: {
            ":sk": "ENTITYTYPE#BOOK",
            ":pk": publication,
          },
        });
      }

      const books = result.Items?.map((item) => {
        if (isBook(item)) {
          return fromDynamoDB(item);
        }
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
      const { id, publication } = req.body;

      const params = {
        TableName: BOOKS_TABLE,
        Key: {
          PK: publication,
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
