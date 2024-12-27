import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import { AppError } from "./lib/appError";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1/user", userRoutes);

app.use((err: AppError, req: Request, res: Response, next: any) => {
  res.status(err.statusCode).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
