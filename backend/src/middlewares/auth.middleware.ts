import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../lib/catchAsync";
import { AppError } from "../lib/appError";
import jwt from "jsonwebtoken";

export const authMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new AppError("Unauthorized", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) throw new AppError("Unauthorized", 401);
    req.userId = (decoded as { id: string }).id;
    next();
  }
);
