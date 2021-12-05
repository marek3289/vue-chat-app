import path from 'path';
import { createServer } from "http";

import express, { Router } from 'express';
import { Server } from "socket.io";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import xss from 'x-xss-protection';
import hpp from 'hpp';

import createError from 'http-errors';
import errorHandler from './utils/errorHandler';
import InMemoryMessageStore from './lib/messageStore'
import InMemoryUserStore from './lib/userStore';
import initSocket from './socket';

require('dotenv').config();

export const userStore = new InMemoryUserStore();
export const messageStore = new InMemoryMessageStore();

export default function initializeServer(router: Router) {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);

  const isProduction = process.env.NODE_ENV === 'production';
  const origin = { origin: isProduction ? false : '*' };

  const limiter = rateLimit({ max: 100, windowMs: 60 * 60 * 1000, message: 'Too many request from the same IP' });
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors(origin));
  app.use(helmet());
  app.use(compression());
  app.use(xss());
  app.use(hpp());

  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use('/api', limiter)
  app.use('/api', router);

  initSocket(io);

  app.all('*', (req, res, next) => next(createError(404, `Can't find ${req.originalUrl} on this server!`)));
  app.use(errorHandler);

  return httpServer;
}
