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

const GALLERY_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET Gallery Images
galleryRoute.get("/gallery", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    // if collection name is present in endpoint, query GSI entityTypePK entityType => ENTITYTYPE#GALLERY#IMAGE and PK = collection
    const { collection } = req.query;

    let result: QueryCommandOutput;

    if (collection) {
      result = await documentClient.query({
        TableName: GALLERY_TABLE,
        IndexName: "entityTypePK", //TODO
        KeyConditionExpression: "entityType = :sk AND PK = :pk",
        ExpressionAttributeValues: {
          ":sk": "ENTITYTYPE#GALLERY#IMAGE",
          ":pk": collection,
        },
      });
    } else {
      result = await documentClient.query({
        TableName: GALLERY_TABLE,
        IndexName: "entityTypeSK",
        KeyConditionExpression: "entityType = :sk",
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
      TableName: GALLERY_TABLE,
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
    const { id, collection } = req.body;
    const params = {
      TableName: GALLERY_TABLE,
      Key: {
        PK: collection,
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
