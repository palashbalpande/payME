import { Router } from "express";
import { userMiddleware } from "../middlewares/user";
import {
  accountBalance,
  depositMoney,
  transferMoney,
} from "../controllers/accountController";

export const accountRouter = Router();

accountRouter.get("/balance", userMiddleware, accountBalance);

accountRouter.post("/transferMoney", userMiddleware, transferMoney);

accountRouter.post("/depositMoney", userMiddleware, depositMoney);
