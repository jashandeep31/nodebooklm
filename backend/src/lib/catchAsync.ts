import { Request, Response, NextFunction } from "express";

interface CatchAsyncFunction {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export const catchAsync = (fn: CatchAsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
