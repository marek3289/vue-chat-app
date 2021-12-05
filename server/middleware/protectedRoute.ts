import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const protectedRotue = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"] as string;

  if (!token) throw createError(401, `No token provided!`);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET = 'FIRST_SECRET_KEY', (err, user) => {
    if (err) throw createError(401, 'Unauthorized');
    req.user = user;
    next();
  });
}

export default protectedRotue;
