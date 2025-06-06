import express from "express";
import { helloRoute } from "./HelloRoute";
import { purchasePaymentRouter } from "./payment_init/payment";
import { handlePaymentRouter } from "./payment_init/handleResponse";
import { userRouter } from "./userProfile";
import { ebookRouter } from "./ebook";
import { bookMarkRouter } from "./bookMarks";

export const routes = express.Router();

routes.use(helloRoute);
routes.use(purchasePaymentRouter);
routes.use(handlePaymentRouter);
routes.use(userRouter);
routes.use(ebookRouter);
routes.use(bookMarkRouter);
