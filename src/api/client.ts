import axios, {
  Axios,
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { NextPageContext } from 'next';
import nookies from 'nookies';

interface CustomAxiosInstance extends AxiosInstance {
  instance: AxiosWrapper;
}

export class AxiosWrapper {
  client: CustomAxiosInstance;
  onRefresh: boolean = false;
  context?: NextPageContext;

  constructor() {
    //@ts-ignore
    const client: CustomAxiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: { 'Content-Type': 'application/json' },
    });
    client.instance = this;
    this.client = client;
    this.client.interceptors.request.use(
      this.onRequestSuccess,
      this.onRequestFailed
    );
    this.client.interceptors.response.use(
      this.onResponseSuccess,
      this.onResponseFailed
    );
  }

  tempTokens?: { access: string; refresh: string };

  //tokens
  getTokens = () => {
    if (this.tempTokens) return this.tempTokens;
    return {
      access: nookies.get(this.context).access,
      refresh: nookies.get(this.context).refresh,
    };
  };

  setTokens = ({ access, refresh }: { access: string; refresh: string }) => {
    nookies.set(this.context, 'access', access, { path: '/' });
    nookies.set(this.context, 'refresh', refresh, { path: '/' });
    return { access, refresh };
  };
  deleteTokens = () => {
    nookies.destroy(this.context, 'access', { path: '/' });
    nookies.destroy(this.context, 'refresh', { path: '/' });
  };

  //interceptors
  onRequestSuccess = (config: InternalAxiosRequestConfig) => {
    const { access, refresh } = this.getTokens();
    if (access && !this.onRefresh)
      config.headers.set('AUTHORIZATION', `Bearer ${access}`);
    return config;
  };
  onRequestFailed = (config: InternalAxiosRequestConfig) => {
    return config;
  };
  onResponseSuccess = (response: AxiosResponse) => response;
  onResponseFailed = async (
    error: AxiosError<{ code: string; detail: string; messages: any[] }>
  ) => {
    if (error.response?.data?.code === 'user_not_found')
      return this.userNotFound(error);
    if (error.response?.data?.code === 'invalid_token')
      return this.invalidToken(error);
    if (
      error.response?.data?.code === 'token_not_valid' &&
      error.response?.status === 401
    ) {
      return this.tokenNotValid(error);
    }
    throw error;
  };

  //errors
  tokenNotValid = async (error: AxiosError) => {
    return new Promise((resolve, reject) => {
      let { access, refresh } = this.getTokens();
      if (refresh) {
        console.log(`refresh:${refresh}`);
        this.onRefresh = true;
        this.client
          .post<{
            access: string;
            refresh: string;
          }>('/auth/refresh/', { refresh })
          .then(({ data }) => {
            this.onRefresh = false;
            this.tempTokens = data;
            this.setTokens(data);
            resolve(
              this.client({
                ...error.config,
                headers: { AUTHORIZATION: `Bearer ${access}` },
              })
            );
          })
          .catch(() => {
            this.deleteTokens();
            reject(error);
          });
      } else {
        this.deleteTokens();
        reject(error);
      }
    });
  };
  userNotFound = async (error: AxiosError) => {
    this.deleteTokens();
    return error;
  };
  invalidToken = async (error: AxiosError) => {
    this.deleteTokens();
    throw error;
  };
  //injections
  setContext = (ctx: NextPageContext) => {
    this.context = ctx;
  };
}

export const client = new AxiosWrapper().client;
