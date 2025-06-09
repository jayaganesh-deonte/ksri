import { Router } from "express";

export const helloRoute = Router();

helloRoute.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express + TypeScript + Lambda!" });
});

helloRoute.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});
