import express from "express";
import { helloRoute } from "./HelloRoute";

export const routes = express.Router();

routes.use(helloRoute);
