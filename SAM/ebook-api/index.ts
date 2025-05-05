import serverlessExpress from "@codegenie/serverless-express";
import app from "./src/app";

module.exports.handler = serverlessExpress({
  app,
});
