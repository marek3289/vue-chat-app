import { Socket } from "socket.io";

export interface IUser {
  userID: string;
  username: string;
  avatar: string;
  connected: boolean;
  messages: any[];
}

export interface IAuthUser extends IUser {
  userID: string;
  username: string;
  password: string;
  connected: boolean;
  avatar: string;
  messages: any[];
}

export type TokenStatusCodes = 200 | 201;

export interface ISocket extends Socket {
  userID?: any;
  username?: any;
  auth?: any;
}
