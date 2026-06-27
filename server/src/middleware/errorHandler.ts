import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof Error) {
    res.status(500).json({ message: err.message || 'Internal server error' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
}
