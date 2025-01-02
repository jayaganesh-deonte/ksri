import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Book,
  BookDDB,
  fromDynamoDB,
  isBook,
  isBookDDB,
  toDynamoDB,
  validateBook,
} from "../../models/library/books";

export const bookRoute = express.Router();

const BOOKS_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri-prod_admin_master_table";

// CREATE Book
bookRoute.post("/library/books", async (req: Request, res: Response) => {
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
      TableName: "ksri-prod_admin_master_table",
      Item: dynamoDBItem,
    });
    res.status(200).json(bookData);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

// GET all books
bookRoute.get("/library/books", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 1000;
    const lastEvaluatedKey = req.query.lastEvaluatedKey
      ? JSON.parse(decodeURIComponent(req.query.lastEvaluatedKey as string))
      : undefined;

    const params = {
      TableName: "ksri-prod_admin_master_table",
      KeyConditionExpression: "PK = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#LIBRARY#BOOK",
      },
      // IndexName: "entityTypeSK",
      ScanIndexForward: false,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const response = await documentClient.query(params);
    const books = response.Items?.map((item) => fromDynamoDB(item as BookDDB));

    res.json({
      data: books,
      lastEvaluatedKey: response.LastEvaluatedKey
        ? encodeURIComponent(JSON.stringify(response.LastEvaluatedKey))
        : null,
      count: books?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// DELETE a book
bookRoute.delete("/library/books", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Book ID is required" });
    }
    const params = {
      TableName: "ksri-prod_admin_master_table",
      Key: {
        PK: "ENTITYTYPE#LIBRARY#BOOK",
        SK: id,
      },
    };
    await documentClient.delete(params);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});
