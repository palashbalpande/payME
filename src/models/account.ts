import mongoose, { model, Schema, Types } from "mongoose";

interface IAccount {
    userId: Types.ObjectId,
    balance: Number,
    email: string
}

const accountSchema = new Schema<IAccount>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    ref: "User",
    required: true,
  }
});

export const Account = model<IAccount>("Account", accountSchema);
