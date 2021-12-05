import api from './api';
import TokenService from './token';
import { IAuthForm, IRegisterForm, IAuthState } from '@/utils/types';
import socket from '../socket';

export const signInAction = async ({ username, password }: IAuthForm): Promise<IAuthState> => {
  try {
    const { data } = await api.post('/users/login', { username, password });
    if (data) TokenService.setUser(data.data);

    return data.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const signUpAction = async ({ username, password, repeatPassword }: IRegisterForm): Promise<IAuthState> => {
  try {
    const { data } = await api.post('/users/register', { username, password, repeatPassword });
    if (data) TokenService.setUser(data.data);

    return data.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const signOutAction = (): void => {
  socket.close();
  TokenService.removeUser();
}

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') as string);
};
