import express, { Request, Response } from "express";
import { documentClient } from "../../db_services/dynamodbClient";

import {
  Event,
  EventDDB,
  toDynamoDB,
  fromDynamoDB,
  validateEvent,
} from "../../models/events/events";

export const eventRoute = express.Router();

const EVENTS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// CREATE Event
eventRoute.post("/events", async (req: Request, res: Response) => {
  try {
    const eventData: Event = req.body;

    // Validate event data
    if (!validateEvent(eventData)) {
      return res.status(400).json({
        error:
          "Invalid event data. Ensure title, initiatedBy and topic are present.",
      });
    }

    // Convert to DynamoDB format
    const dynamoDBItem = toDynamoDB(eventData);

    // Put item in DynamoDB
    await documentClient.put({
      TableName: EVENTS_TABLE,
      Item: dynamoDBItem,
    });

    res.status(200).json(eventData);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// GET all events
eventRoute.get("/events", async (req: Request, res: Response) => {
  try {
    const params = {
      TableName: EVENTS_TABLE,
      KeyConditionExpression: "entityType = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#EVENT",
      },
      IndexName: "entityTypeSK",
      ScanIndexForward: false,
    };

    const { Items } = await documentClient.query(params);

    const events = Items?.map((item) => fromDynamoDB(item as EventDDB)) || [];

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// DELETE an event
eventRoute.delete("/events", async (req: Request, res: Response) => {
  try {
    const { id, title } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const params = {
      TableName: EVENTS_TABLE,
      Key: {
        PK: title,
        SK: id,
      },
    };

    await documentClient.delete(params);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});
