import { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  res.status(404).json({ error: { message: 'Route not found', status: 404 } });
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
  const error = {
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode ?? 500
  };

  console.error(err);

  res.status(error.statusCode).json({ error: { message: error.message, status: error.statusCode } });
}