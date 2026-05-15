import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const originalJson = res.json;

  // Intercept res.json to log the response immediately
  res.json = function (body: any) {
    // log the request and response details here

    return originalJson.call(res, body); // Continue with the original response method
  };

  next();
};
