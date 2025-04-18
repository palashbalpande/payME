import "dotenv/config.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { userRouter } from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 8080;

const main = async () => {
  try {
    await connectDB();
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error connecting to Database", err.message);
    } else {
      console.error("encounterd and unknown error");
    }
  }
};

main();
