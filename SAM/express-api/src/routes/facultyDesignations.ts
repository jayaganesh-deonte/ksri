import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  FacultyDesignation,
  FacultyDesignationDDB,
  toDynamoDB,
  fromDynamoDB,
  validateFacultyDesignationDDB,
  validateFacultyDesignation,
} from "../models/facultyDesignations";

export const facultyDesignationRouter = express.Router();

// GET Faculty Designations
facultyDesignationRouter.get(
  "/faculty/designation",
  async (req: Request, res: Response) => {
    try {
      // option type query parameter
      const { designationType } = req.query;

      // if type is provide, validate it
      if (designationType !== undefined) {
        if (
          designationType !== "ACADEMIC" &&
          designationType !== "NON ACADEMIC"
        ) {
          return res.status(400).json({ error: "Invalid query parameter" });
        }
      }

      // query table using GSI and filter based on designationType if provided
      const params: any = {
        TableName: process.env.DDB_TABLE_NAME,
        // IndexName: "entityTypeSK",
        KeyConditionExpression: "PK = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#FACULTYDESIGNATION",
        },
        // id is lexicographically sorted so sort it from old to new
        ScanIndexForward: false,
      };

      if (designationType) {
        params.FilterExpression = "#type = :designationType";
        params.ExpressionAttributeNames = {
          "#type": "type",
        };
        params.ExpressionAttributeValues[":designationType"] = designationType;
      }

      const result = await documentClient.query(params);
      res.json(
        result.Items?.map((item) => fromDynamoDB(item as FacultyDesignationDDB))
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// POST Faculty Designation
facultyDesignationRouter.post(
  "/faculty/designation",
  async (req: Request, res: Response) => {
    const facultyDesignation: FacultyDesignation = req.body;
    if (!validateFacultyDesignation(facultyDesignation)) {
      return res.status(400).json({ error: "Invalid facultyDesignation data" });
    }
    const facultyDesignationDDB: FacultyDesignationDDB =
      toDynamoDB(facultyDesignation);
    try {
      await documentClient.put({
        TableName: process.env.DDB_TABLE_NAME,
        Item: facultyDesignationDDB,
      });
      res.status(200).json(facultyDesignation);
    } catch (error) {
      console.error("Error creating facultyDesignation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// DELETE Faculty Designation
facultyDesignationRouter.delete(
  "/faculty/designation",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: "ENTITYTYPE#FACULTYDESIGNATION",
          SK: id,
        },
      };
      await documentClient.delete(params);
      res
        .status(200)
        .json({ message: "Faculty Designation deleted successfully" });
    } catch (error) {
      console.error("Error deleting facultyDesignation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
