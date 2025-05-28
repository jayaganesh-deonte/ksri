import express, { Request, Response } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  User,
  UserDDB,
  fromDynamoDB,
  toDynamoDB,
  validateUser,
  validateUserDDB,
} from "../models/user";

const userRouter = express.Router();

// get User Profile using email
userRouter.get("/userProfile/:email", async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: "USER#" + email,
        SK: "USER#" + email,
      },
    };

    const data = await documentClient.get(params);
    if (!data.Item) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDDB = data.Item as UserDDB;
    if (validateUserDDB(userDDB)) {
      const user = fromDynamoDB(userDDB);
      res.status(200).json(user);
    } else {
      res.status(500).json({ error: "Invalid user data" });
    }

    // if (data.Items && data.Items.length > 0) {
    //   const userDDB = data.Items[0] as UserDDB;
    //   if (validateUserDDB(userDDB)) {
    //     const user = fromDynamoDB(userDDB);
    //     res.status(200).json(user);
    //   } else {
    //     res.status(500).json({ error: "Invalid user data" });
    //   }
    // } else {
    //   res.status(404).json({ error: "User not found" });
    // }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update/create user profile
userRouter.post("/userProfile", async (req: Request, res: Response) => {
  const user = req.body as User;

  if (!validateUser(user)) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  try {
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Item: toDynamoDB(user),
    };

    await documentClient.put(params);

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { userRouter };
