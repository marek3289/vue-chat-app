export enum AuthTypes {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface IMessage {
  message: string;
  fromSelf: boolean;
  seen?: boolean;
  from?: string;
  timestamp?: any;
}

export interface IUser {
  username: string;
  userID: string;
  self: boolean;
  connected: boolean;
  messages: IMessage[];
  newMessagesCount: number;
  typing: boolean;
}

export interface IAuthState {
  accessToken: string;
  refreshToken: string;
  user: IUser | {};
}

export interface IAuthForm {
  username: string;
  password: string;
}

export interface IRegisterForm extends IAuthForm {
  repeatPassword: string;
}
