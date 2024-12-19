import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  PostalAddress,
  PostalAddressDDB,
  toDynamoDB,
  fromDynamoDB,
  isPostalAddress,
} from "../../models/contribute/postalAddress";

export const postalAddressRoute = express.Router();

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// CREATE PostalAddress
postalAddressRoute.post(
  "/contribute/postalAddress",
  async (req: Request, res: Response) => {
    try {
      const postalAddressData: PostalAddress = req.body;

      if (!isPostalAddress(postalAddressData)) {
        return res.status(400).json({
          error:
            "Invalid postal address data. Ensure instituteName, address, email and phone are present.",
        });
      }

      // Convert to DynamoDB format
      const dynamoDBItem = toDynamoDB(postalAddressData);

      // Put item in DynamoDB
      await documentClient.put({
        TableName: TABLE_NAME,
        Item: dynamoDBItem,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error creating postal address:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET PostalAddress
postalAddressRoute.get(
  "/contribute/postalAddress",
  async (req: Request, res: Response) => {
    try {
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#POSTALADDRESS",
        },
        IndexName: "entityTypePK",
      };

      const { Items } = await documentClient.query(params);

      const postalAddress =
        Items?.map((item) => fromDynamoDB(item as PostalAddressDDB)) || [];

      res.json(postalAddress);
    } catch (error) {
      console.error("Error getting postal address:", error);
      res.status(500).json({ error: "Failed to get postal address" });
    }
  }
);

// DELETE PostalAddress
postalAddressRoute.delete(
  "/contribute/postalAddress",
  async (req: Request, res: Response) => {
    try {
      const { id, name } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Postal address ID is required" });
      }
      if (!name) {
        return res
          .status(400)
          .json({ error: "Postal address name is required" });
      }
      const params = {
        TableName: TABLE_NAME,
        Key: {
          PK: name,
          SK: id,
        },
      };
      await documentClient.delete(params);
      res.status(200).json({ message: "Postal address deleted successfully" });
    } catch (error) {
      console.error("Error deleting postal address:", error);
      res.status(500).json({ error: "Failed to delete postal address" });
    }
  }
);
