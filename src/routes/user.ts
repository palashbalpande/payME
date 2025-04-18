import { Router } from "express";
import { validateSignUpSchema } from "../middlewares/validateSignUpSchema";
import {
  signInUser,
  signUpUser,
  updateUser,
} from "../controllers/authController";
import { userMiddleware } from "../middlewares/user";

export const userRouter = Router();

userRouter.post("/signup", validateSignUpSchema, signUpUser);

userRouter.post("/signin", signInUser);

userRouter.patch("/update", userMiddleware, updateUser);
