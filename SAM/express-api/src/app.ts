import express, { NextFunction, Request, Response } from "express";
const cors = require("cors");
import { routes } from "./routes";
require("dotenv").config();

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3001;

const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;

let REGION: string;
let USER_POOL_ID: string;
let CLIENT_ID: string;
let ALLOWED_URL: string;

let verifier: any;

if (AWS_LAMBDA_FUNCTION_NAME) {
  REGION = process.env.AWS_REGION ?? "";
  USER_POOL_ID = process.env.USER_POOL_ID ?? "";
  CLIENT_ID = process.env.CLIENT_ID ?? "";
  ALLOWED_URL = process.env.ALLOWED_URL ?? "";

  // Verifier that expects valid access tokens:
  verifier = CognitoJwtVerifier.create({
    userPoolId: USER_POOL_ID,
    tokenUse: "id",
    clientId: CLIENT_ID,
  });
}

const middlewareFunction = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // if the request route contains the name public in it then perform captcha auth
  const requestRoute = req.originalUrl;
  if (requestRoute.includes("public")) {
    next();
    return;
  }

  if (AWS_LAMBDA_FUNCTION_NAME == undefined) {
    next();
  } else {
    const Authorization = req.headers["authorization"];
    if (!Authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = Authorization.split(" ")[1];
    try {
      const payload = await verifier.verify(token, {
        tokenUse: "id",
        clientId: CLIENT_ID,
      });
      next();
    } catch {
      console.error("Token not valid");
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};

// Middleware
app.use(express.json());

const corsOption = {
  origin: ["*"],
};

if (!AWS_LAMBDA_FUNCTION_NAME) {
  app.use(cors());
} else {
  app.use(cors(corsOption));
}

app.use(middlewareFunction);

app.use("/", routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("error in app: ", err); // Log the error for debugging

  // Set the status code to 500 (Internal Server Error)
  res.status(500);

  // Send a generic error message in production (avoid leaking sensitive details)
  if (app.get("env") === "production") {
    res.send("Something went wrong!");
  } else {
    // Send a more detailed error message in development (for troubleshooting)
    res.send(err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export app
export default app;
