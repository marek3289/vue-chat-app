import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '@/store';
import TokenService from './token';
import { AuthTypes } from '@/utils/types';

// const baseURL = process.env.REACT_APP_BACKEND_URL;
const baseURL = 'http://localhost:5000/api';
const headers = { 'Content-Type': 'application/json' };

const axiosInstance: AxiosInstance = axios.create({ baseURL, timeout: 10000, headers });

// Dodwanie access token do headers w request config
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = TokenService.getLocalAccessToken();
    if (token) config.headers['x-access-token'] = token;

    return config;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => new Promise(resolve => resolve(response)),
  async (err: AxiosError) => {
    const originalConfig: any = err.config;

    // Access Token was expired
    if (!['/users/login', '/users/register'].includes(originalConfig.url) && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const { data } = await axiosInstance.post('/users/token', { refreshToken: TokenService.getLocalRefreshToken() });
          TokenService.updateLocalAccessToken(data.accessToken);

          return axiosInstance(originalConfig);
        } catch (err: any) {
          store.dispatch(AuthTypes.LOGOUT);

          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(err);
  },
);

export default axiosInstance;
