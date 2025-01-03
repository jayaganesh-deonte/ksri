import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  GalleryImage,
  GalleryImageDDB,
  fromDynamoDB,
  toDynamoDB,
  validateGalleryImage,
  validateGalleryImageDDB,
} from "../../models/gallery/gallery";
import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";

export const galleryRoute = express.Router();

// GET Gallery Images
galleryRoute.get("/gallery", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    // if collection name is present in endpoint, query GSI entityTypePK entityType => ENTITYTYPE#GALLERY#IMAGE and PK = collection
    const { collection } = req.query;

    let result: QueryCommandOutput;

    if (collection) {
      result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "CollectionSK", //TODO
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": "ENTITYTYPE#GALLERY#IMAGE",
          ":collection": collection,
        },
        // filter
        FilterExpression: "collection = :collection",
      });
    } else {
      result = await documentClient.query({
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        KeyConditionExpression: "PK = :sk",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#GALLERY#IMAGE",
        },
      });
    }

    const galleryImages = result.Items?.map((item) =>
      fromDynamoDB(item as GalleryImageDDB)
    );

    res.json(galleryImages);
  } catch (error) {
    console.error("Error fetching Gallery Images:", error);
    res.status(500).json({ error: "Failed to fetch Gallery Images" });
  }
});

// POST Gallery Image
galleryRoute.post("/gallery", async (req: Request, res: Response) => {
  try {
    const galleryImage: GalleryImage = req.body;
    if (!validateGalleryImage(galleryImage)) {
      return res.status(400).json({ error: "Invalid gallery image data" });
    }

    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Item: toDynamoDB(galleryImage),
    };

    await documentClient.put(params);

    res.status(200).json(galleryImage);
  } catch (error) {
    console.error("Error creating gallery image:", error);
    res.status(500).json({ error: "Failed to create gallery image" });
  }
});

// DELETE Gallery Image
galleryRoute.delete("/gallery", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "ENTITYTYPE#GALLERY#IMAGE",
        SK: id,
      },
    };
    await documentClient.delete(params);
    res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).json({ error: "Failed to delete gallery image" });
  }
});
