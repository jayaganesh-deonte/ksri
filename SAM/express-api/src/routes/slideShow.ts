import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";
import {
  SlideShow,
  SlideShowDDB,
  toDynamoDB,
  fromDynamoDB,
  validateSlideShow,
} from "../models/slideShowModel";

export const slideShowRoute = Router();

slideShowRoute.get("/slideshow", async (req: Request, res: Response) => {
  try {
    const queryParams = {
      TableName: process.env.DDB_TABLE_NAME,
      ScanIndexForward: false,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "ENTITYTYPE#SLIDESHOW",
      },
    };
    const result = await documentClient.query(queryParams);

    const slideShows = result.Items?.map((item) =>
      fromDynamoDB(item as SlideShowDDB)
    );

    res.json(slideShows);
  } catch (error) {
    console.error("Error fetching slideShows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create slideshow

slideShowRoute.post("/slideshow", async (req: Request, res: Response) => {
  const slideShow: SlideShow = req.body;

  console.log("slideShow", slideShow);

  if (!validateSlideShow(slideShow)) {
    return res.status(400).json({ error: "Invalid slideShow data" });
  }

  const slideShowDDB: SlideShowDDB = toDynamoDB(slideShow);

  const queryParams = {
    TableName: process.env.DDB_TABLE_NAME,
    Item: slideShowDDB,
  };

  try {
    await documentClient.put(queryParams);
    res.status(200).json(slideShow);
  } catch (error) {
    console.error("Error creating slideShow:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Slideshow
slideShowRoute.delete("/slideshow", async (req: Request, res: Response) => {
  const { id } = req.body;

  const queryParams = {
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
      PK: "ENTITYTYPE#SLIDESHOW",
      SK: id,
    },
  };

  try {
    await documentClient.delete(queryParams);
    res.status(200).json({ message: "SlideShow deleted successfully" });
  } catch (error) {
    console.error("Error deleting slideShow:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
