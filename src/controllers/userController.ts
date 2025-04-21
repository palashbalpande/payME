import bcrypt from "bcrypt";
import { SignUpBody } from "../middlewares/userSignUpSchema";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { getJwtUserCode } from "../utils/getJwtUserCode";
import jwt from "jsonwebtoken";
import { Account } from "../models/account";

export const signUpUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body as SignUpBody;
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already exist" });
      return;
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const userId = user._id;
    /// --------- Create new account ----------

    await Account.create({
      userId,
      balance: 0,
      email,
    });

    /// ---------------------------------------

    res.status(201).json({ message: "Signup succeded" });
    next();
  } catch (err) {
    console.error("Error during Signup: ", err);
    res.status(409).json({
      message: "User already exists",
      error: err instanceof Error ? err.message : "Unknown Error",
    });
  }
};

export const signInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid creds" });
      return;
    }

    const JWT_USER_CODE = getJwtUserCode("JWT_USER_CODE");
    const token = jwt.sign({ id: user._id }, JWT_USER_CODE);
    res.json({ message: "Login Succeeded", token });
    next();
  } catch (err) {
    console.error("Error login: ", err);
    res.status(403).json({
      message: "Login failed, Incorrect Creds",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized userId" });
      return;
    }
    const { firstName, lastName, email, password } =
      req.body as Partial<SignUpBody>;

    const updates: Record<string, string | undefined> = {};

    if (firstName) {
      updates.firstName = firstName;
    }
    if (lastName) {
      updates.lastName = lastName;
    }
    if (email) {
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail && existingUserEmail._id.toString() != userId) {
        res.status(409).json({ message: "Your updated email already exist" });
        return;
      }
      updates.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8);
      updates.password = hashedPassword;
    }
    if (Object.keys(updates).length === 0) {
      res.status(200).json({ message: "No updates provided" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User updation succeeded", user: updatedUser });
    next();
  } catch (err) {
    console.error("Error updating user: ", err);
    res.status(500).json({
      message: "Failed to update user",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const findUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter = req.query.filter || "";
    const loggedInUser = req.userId;

    const users = await User.find({
      $and: [
        {
          _id: { $ne: loggedInUser },
        },
        {
          $or: [
            {
              firstName: {
                $regex: filter,
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: filter,
                $options: "i",
              },
            },
          ],
        },
      ],
    });

    res.json({
      user: users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      })),
    });
  } catch (err) {
    console.error("Error finding user: ", err);
    res.status(500).json({
      message: "Failed to fetch user",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
