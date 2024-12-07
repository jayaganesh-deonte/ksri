import { Router } from "express";

export const helloRoute = Router();

helloRoute.get("/", (req, res) => {
  res.send("Hello World!");
});
