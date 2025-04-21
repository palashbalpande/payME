import { NextFunction, Request, Response } from "express";
import { userUpdateSchema } from "./userUpdateSchema";

export const validateUpdateSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = userUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      message: "Email taken or Incorrect inputs",
      error: validation.error?.format(),
    });
  }
  next();
};
