import { Request, Response, NextFunction } from "express";

interface CatchAsyncFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const catchAsync = (fn: CatchAsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
