import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import createError from 'http-errors';

import { filterByKeys, getRandomId } from '../utils/helpers';
import { TokenStatusCodes, IAuthUser } from '../utils/types';
import { userStore } from '../server';

const signAccessToken = (id: string) => jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET = 'FIRST_SECRET_KEY', { expiresIn: '15s' });
const signRefreshToken = (id: string) => jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET = 'SECOND_SECRET_KEY', { expiresIn: '2 days' });

const createSendToken = (user: IAuthUser, statusCode: TokenStatusCodes, res: Response) => {
  const accessToken = signAccessToken(user.userID);
  const refreshToken = signRefreshToken(user.userID);

  const filteredUser = filterByKeys(user, 'password');

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: filteredUser,
      accessToken,
      refreshToken
    }});
};

const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) throw createError(401, 'Username or password is incorrect');

  const user = userStore.findAllUsers().find(u => u.username === username);
  const isCorrect = user && await bcrypt.compare(password, user.password);

  if (!user || !isCorrect) throw createError(401, 'Username or password is incorrect');

  createSendToken(user, 200, res);
});

const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { username, password, repeatPassword } = req.body;

  if (!username || !password || !repeatPassword) throw createError(401, 'Username or password is incorrect');

  const isUserExist = !!userStore.findAllUsers().find(u => u.username === username);
  if (isUserExist) throw createError(401, 'User with that username already exist');

  const isPasswordCorrect = password === repeatPassword;
  if (!isPasswordCorrect) throw createError(401, 'Passwords do not match');
  
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const userID = getRandomId();
  const newUser = { userID, username, password: hashedPassword, avatar: 'default-avatar', connected: false, messages: [] };

  userStore.saveUser(userID, newUser);

  createSendToken(newUser, 201, res);
});

const logout = async (_req: Request, res: Response, _next: NextFunction) => res.redirect('/');

const refreshToken = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const refreshToken: string = req.body.refreshToken;
  
  if (!refreshToken) throw createError(403, 'Refresh token not found, login again');
  
  // If the refresh token is valid, create a new accessToken and return it.
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET = 'SECOND_SECRET_KEY', (err, user: any) => {
    if (err) throw createError(403, 'Refresh token expired or invalid');
    const accessToken = signAccessToken(user.userID);
    res.status(200).json({ status: 'success', accessToken });
  });
});

export default {
  register,
  login,
  logout,
  refreshToken,
};
