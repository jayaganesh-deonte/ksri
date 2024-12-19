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

const FACULTY_DESIGNATION_TABLE =
  process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET Faculty Designations
facultyDesignationRouter.get(
  "/faculty/designation",
  async (req: Request, res: Response) => {
    try {
      // query table using GSI
      const result = await documentClient.query({
        TableName: FACULTY_DESIGNATION_TABLE,
        IndexName: "entityTypeSK",
        KeyConditionExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
          ":entityType": "ENTITYTYPE#FACULTYDESIGNATION",
        },
        //   id is lexagraphically sorted so sort it from old to new
        ScanIndexForward: false,
      });
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
        TableName: FACULTY_DESIGNATION_TABLE,
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
        TableName: FACULTY_DESIGNATION_TABLE,
        Key: {
          PK: id,
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
