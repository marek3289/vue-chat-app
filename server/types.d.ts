import { Server } from "socket.io";
import { JwtPayload } from 'jsonwebtoken';

declare module "express-serve-static-core" { 
  export interface Request {
    user?: JwtPayload;
  }
  export interface Response {
    io: Server;
  }
}
