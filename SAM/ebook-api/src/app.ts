import express, { NextFunction, Request, Response } from "express";
const cors = require("cors");
import { routes } from "./routes";
require("dotenv").config();

import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger();

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());

const corsOption = {
  origin: ["*"],
};

const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;

if (!AWS_LAMBDA_FUNCTION_NAME) {
  app.use(cors());
} else {
  app.use(cors(corsOption));
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

  // Add response logging
  res.on("finish", () => {
    logger.info("Request completed", {
      component: "middleware",
      statusCode: res.statusCode,
      responseTime: Date.now() - new Date(requestMetadata.timestamp).getTime(),
      ...requestMetadata,
    });
  });

  next();
};
app.use(middlewareFunction);

app.use("/e-v1/", routes);

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

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
// export app
export default app;
