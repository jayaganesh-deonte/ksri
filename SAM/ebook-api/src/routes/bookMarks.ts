import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";
import { getUserDetails } from "../cognito/decrypt";

import {
  BookMark,
  BookMarkDDB,
  fromDynamoDB,
  toDynamoDB,
  validateBookMark,
  validateBookMarkDDB,
} from "../models/bookMark";

const bookMarkRouter = express.Router();

// get book mark using bookId
bookMarkRouter.get("/bookMark/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  // get auth
  console.log("headers", req.headers);
  const token = req.headers["x-amz-id-token"] as string;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userDetails = await getUserDetails(token);

  const email = userDetails?.email;

  try {
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#BOOKMARK",
        SK: "BOOKMARK#" + email + "#" + bookId,
      },
    };

    const data = await documentClient.get(params);
    if (!data.Item) {
      return res.status(404).json({ error: "Book Mark not found" });
    }
    const bookMarkDDB = data.Item as BookMarkDDB;
    if (validateBookMarkDDB(bookMarkDDB)) {
      const bookMark = fromDynamoDB(bookMarkDDB);
      res.status(200).json(bookMark);
    } else {
      res.status(500).json({ error: "Invalid book mark data" });
    }
  } catch (error) {
    console.error("Error fetching book mark:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// post bookmarks
bookMarkRouter.post(
  "/bookMark/:bookId",
  async (req: Request, res: Response) => {
    const bookMark = req.body as BookMark;

    // get auth
    console.log("headers", req.headers);
    const token = req.headers["x-amz-id-token"] as string;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userDetails = await getUserDetails(token);

    const email = userDetails?.email as string;
    const bookId = req.params.bookId;

    try {
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: toDynamoDB({
          bookId,
          userEmail: email,
          bookMarks: bookMark,
        }),
      };

      await documentClient.put(params);

      res.status(200).json({ message: "Book mark updated successfully" });
    } catch (error) {
      console.error("Error updating book mark:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export { bookMarkRouter };
