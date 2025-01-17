import express, { NextFunction, Request, Response } from "express";
const cors = require("cors");
import { routes } from "./routes";
require("dotenv").config();

import { Logger } from "@aws-lambda-powertools/logger";

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";
import { json } from "stream/consumers";

const logger = new Logger();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3001;

const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;

const CODEBUILD_BUILD_ARN = process.env.CODEBUILD_BUILD_ARN;

let REGION: string;
let USER_POOL_ID: string;
let CLIENT_ID: string;
let ALLOWED_URL: string;

let verifier: any;

if (AWS_LAMBDA_FUNCTION_NAME && CODEBUILD_BUILD_ARN == undefined) {
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
  // Add correlation ID for request tracking
  const correlationId = req.headers["x-correlation-id"] || crypto.randomUUID();
  logger.appendKeys({
    correlationId: correlationId,
  });

  // Capture request metadata
  const requestMetadata = {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  };

  logger.info("Incoming request", {
    ...requestMetadata,
    component: "middleware",
  });

  // if the request route contains the name public in it then perform captcha auth
  const requestRoute = req.originalUrl;
  if (requestRoute.includes("public")) {
    logger.info("Public route accessed", {
      path: requestRoute,
      component: "middleware",
    });
    next();
    return;
  }

  if (AWS_LAMBDA_FUNCTION_NAME == undefined) {
    logger.info("Local development environment detected", {
      component: "middleware",
    });
    next();
  } else {
    const Authorization = req.headers["authorization"];
    if (!Authorization) {
      logger.warn("Authorization header missing", {
        component: "middleware",
        ...requestMetadata,
      });
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = Authorization;
    try {
      const payload = await verifier.verify(token, {
        tokenUse: "id",
        clientId: CLIENT_ID,
      });
      // Add user metadata from token payload
      logger.appendKeys({
        userId: payload.sub,
        username: payload["cognito:username"] || "",
        userGroups: payload["cognito:groups"] || [],
      });

      logger.info("Token verified successfully", {
        component: "middleware",
        userId: payload.sub,
      });
      // console.log("Token is valid. Payload:", payload);
      next();
    } catch (error) {
      logger.error("Token verification failed", {
        component: "middleware",
        error: error instanceof Error ? error.message : "Unknown error",
        ...requestMetadata,
      });

      console.error("Token not valid");
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  // Add response logging
  res.on("finish", () => {
    logger.info("Request completed", {
      component: "middleware",
      statusCode: res.statusCode,
      responseTime: Date.now() - new Date(requestMetadata.timestamp).getTime(),
      ...requestMetadata,
    });
  });
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
