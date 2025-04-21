import { Request, Response } from "express";
import { Account } from "../models/account";
import { startSession } from "mongoose";
import { number } from "zod";

export const accountBalance = async (req: Request, res: Response) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });
    res.json({
      balance: account?.balance,
    });
  } catch (err) {
    console.error("Error fetching balance: ", err);
    res.status(500).json({
      message: "Failed to fetch balance",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const transferMoney = async (req: Request, res: Response) => {
  try {
    const session = await startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      res.status(400).json({
        message: "Insuffiecient funds",
      });
      return;
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      res.status(400).json({ message: "Invalid account" });
      return;
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();

    res.json({
      message: "Transfer succesfull",
    });
  } catch (err) {
    console.error("Error transfering money: ", err);
    res.status(500).json({
      message: "Failed to transfer money",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const depositMoney = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      res.status(400).json({
        message: "Invalid amount",
      });
      return;
    }

    const account = await Account.findOneAndUpdate(
      {
        userId,
      },
      {
        $inc: { balance: amount },
      },
      {
        new: true,
      }
    );
    if (!account) {
      res.status(400).json({
        message: "Accout not found for this user",
      });
      return;
    }
    res.status(200).json({
      message: "Funds deposited successfully",
      balance: account.balance,
    });
  } catch (err) {
    console.error("Error depositing money: ", err),
      res.status(500).json({
        message: "Failed to deposite money",
        error: err instanceof Error ? err.message : "Unknown error",
      });
  }
};
