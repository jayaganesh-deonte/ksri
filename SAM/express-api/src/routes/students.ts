import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";
import {
  Student,
  StudentDDB,
  toDynamoDB,
  fromDynamoDB,
  validateStudent,
} from "../models/students";

export const studentRoute = Router();

const STUDENTS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// CREATE Student
studentRoute.post("/students", async (req: Request, res: Response) => {
  try {
    const studentData: Student = req.body;

    // Validate student data
    if (!validateStudent(studentData)) {
      return res.status(400).json({
        error: "Invalid student data. Ensure name and description are present.",
      });
    }

    // Convert to DynamoDB format
    const dynamoDBItem = toDynamoDB(studentData);

    // Put item in DynamoDB
    await documentClient.put({
      TableName: STUDENTS_TABLE,
      Item: dynamoDBItem,
    });

    res.status(200).json(studentData);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
});

// GET Students
studentRoute.get("/students", async (req: Request, res: Response) => {
  try {
    // query table using GSI with optional filters for status and course
    const { status, course } = req.query;

    let filterExpression = [];
    let expressionAttributeValues: any = {
      ":sk": "ENTITYTYPE#STUDENT",
    };
    let expressionAttributeNames: any = {};

    if (status) {
      filterExpression.push("#st = :status");
      expressionAttributeValues[":status"] = status;
      expressionAttributeNames["#st"] = "status";
    }

    if (course) {
      filterExpression.push("course = :course");
      expressionAttributeValues[":course"] = course;
    }

    const result = await documentClient.query({
      TableName: STUDENTS_TABLE,
      IndexName: "entityTypePK",
      ScanIndexForward: false,
      KeyConditionExpression: "entityType = :sk",
      FilterExpression:
        filterExpression.length > 0
          ? filterExpression.join(" AND ")
          : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames:
        Object.keys(expressionAttributeNames).length > 0
          ? expressionAttributeNames
          : undefined,
    });

    const students = result.Items?.map((item) =>
      fromDynamoDB(item as StudentDDB)
    );

    res.json(students);
  } catch (error) {
    console.error("Error fetching scholars:", error);
    res.status(500).json({ error: "Failed to fetch scholars" });
  }
});

// UPDATE Student
studentRoute.put("/students", async (req: Request, res: Response) => {
  try {
    const studentData: Student = req.body;

    // Validate student data
    if (!validateStudent(studentData)) {
      return res.status(400).json({
        error: "Invalid student data. Ensure name and description are present.",
      });
    }

    // Convert to DynamoDB format
    const dynamoDBItem = toDynamoDB(studentData);

    // Update item in DynamoDB
    await documentClient.put({
      TableName: STUDENTS_TABLE,
      Item: dynamoDBItem,
    });

    res.status(200).json(studentData);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

//  DELETE Student
studentRoute.delete("/students", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;

    // Delete item from DynamoDB
    await documentClient.delete({
      TableName: STUDENTS_TABLE,
      Key: {
        PK: name,
        SK: id,
      },
    });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});
