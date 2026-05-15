import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
  });

  res.status(500).json({
    error: 'Internal Server Error',
  });
};
