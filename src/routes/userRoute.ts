import { Router } from "express";
import { validateSignUpSchema } from "../middlewares/validateSignUpSchema";
import {
  findUser,
  signInUser,
  signUpUser,
  updateUser,
} from "../controllers/userController";
import { userMiddleware } from "../middlewares/user";
import { validateUpdateSchema } from "../middlewares/validateUserUpdateSchema";

export const userRouter = Router();

userRouter.post("/signup", validateSignUpSchema, signUpUser);

userRouter.post("/signin", signInUser);

userRouter.patch("/update", userMiddleware, validateUpdateSchema, updateUser);

userRouter.get("/search", userMiddleware, findUser);
