import express from "express";
import { handlePaymentRouter } from "./payment_init/handleResponse";

export const routes = express.Router();

routes.use(handlePaymentRouter);
