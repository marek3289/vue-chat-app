import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

const handleJWTError = () => createError(401, 'Invalid token. Please log again');
const handleJWTExpiredError = () => createError(401, 'Token expired. Please log again');

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err.stack, err.status);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Failure';

  let error = { ...err, name: err.name };
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};

export default errorHandler;
