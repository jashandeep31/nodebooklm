import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../lib/catchAsync";
import { AppError } from "../lib/appError";
import { db } from "../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    const user = await db.user
      .create({
        data: {
          email,
          password: await bcrypt.hash(password, 10),
        },
      })
      .catch((e) => {
        throw new AppError("User already exists", 400);
      });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token,
    });
  }
);

export const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Invalid password", 401);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  }
);
