import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  Faculty,
  FacultyDDB,
  toDynamoDB,
  fromDynamoDB,
  validateFacultyDDB,
  validateFaculty,
} from "../models/faculty";

export const facultyRouter = express.Router();

const FACULTY_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET Faculty
facultyRouter.get("/faculty", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: FACULTY_TABLE,
      IndexName: "entityTypeSK",
      KeyConditionExpression: "entityType = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#FACULTY",
      },
      //   id is lexagraphically sorted so sort it from old to new
      ScanIndexForward: false,
    });

    const faculty = result.Items?.map((item) =>
      fromDynamoDB(item as FacultyDDB)
    );

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST Faculty
facultyRouter.post("/faculty", async (req: Request, res: Response) => {
  const faculty: Faculty = req.body;

  if (!validateFaculty(faculty)) {
    return res.status(400).json({ error: "Invalid faculty data" });
  }

  const facultyDDB: FacultyDDB = toDynamoDB(faculty);

  try {
    await documentClient.put({
      TableName: FACULTY_TABLE,
      Item: facultyDDB,
    });

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  DELETE Faculty
facultyRouter.delete("/faculty", async (req: Request, res: Response) => {
  try {
    const { name, id } = req.body;
    const params = {
      TableName: FACULTY_TABLE,
      Key: {
        PK: name,
        SK: id,
      },
    };
    await documentClient.delete(params);

    res.status(200).json({ message: "Faculty deleted successfully." });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ error: "Failed to delete faculty." });
  }
});
