import { NextFunction, Request, Response } from "express";
import { userSignUpSchema } from "./userSignUpSchema";

export const validateSignUpSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = userSignUpSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      message: "Email taken OR Incorrect inputs",
      error: validation.error?.format(),
    });
  }
  next();
};
