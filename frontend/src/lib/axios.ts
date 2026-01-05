import axios, { AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

const getBaseUrl = () => {
  return env.API_URL || 'http://localhost:4201/shanda';
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: getBaseUrl(),
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
