import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  User,
  UserDDB,
  toDynamoDB,
  fromDynamoDB,
  validateUser,
} from "../models/users";

import {
  createUserInCognito,
  updateUserGroup,
  deleteUserFromCognito,
} from "../cognito_services/cognito";

const USER_POOL_ID = process.env.USER_POOL_ID ?? "ap-south-1_VHRb4I0Ig";

// GET all users
export const userRoute = Router();

const USERS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// GET all users
userRoute.get("/users", async (req: Request, res: Response) => {
  try {
    // query table using GSI
    const result = await documentClient.query({
      TableName: USERS_TABLE,
      IndexName: "entityTypePK",
      KeyConditionExpression: "entityType = :sk",
      ExpressionAttributeValues: {
        ":sk": "ENTITYTYPE#USER",
      },
    });

    const users = result.Items?.map((item) => fromDynamoDB(item as UserDDB));

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// DELETE a user
userRoute.delete("/users", async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    // Delete item from DynamoDB
    await documentClient.delete({
      TableName: USERS_TABLE,
      Key: {
        PK: name,
        SK: id,
      },
      //   ConditionExpression: "attribute_exists(id)",
    });
    const cognitoResponse = await deleteUserFromCognito({
      email: name,
      userPoolId: USER_POOL_ID,
    });
    console.log("cognitoResponse", cognitoResponse);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// CREATE User
userRoute.post("/users", async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    if (!validateUser(user)) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const userDDB: UserDDB = toDynamoDB(user);

    await documentClient.put({
      TableName: USERS_TABLE,
      Item: userDDB,
    });

    const cognitoResponse = await createUserInCognito({
      name: user.name,
      email: user.email,
      userPoolId: USER_POOL_ID,
      group: user.group,
    });
    console.log("cognitoResponse", cognitoResponse);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});