import { Router } from "express";
import { userRouter } from "./userRoute";
import { accountRouter } from "./accountRoute";

export const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/account", accountRouter);
