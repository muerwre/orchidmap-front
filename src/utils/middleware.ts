import { AxiosRequestConfig } from "axios";

export type Unwrap<T> = T extends (...args: any[]) => Promise<infer U> ? U : T;

export interface IApiErrorResult {
  detail?: string;
  code?: string;
}

export interface IResultWithStatus<T> {
  status: any;
  data?: Partial<T> & IApiErrorResult;
  error?: string;
  debug?: string;
}

export const HTTP_RESPONSES = {
  SUCCESS: 200,
  CREATED: 201,
  CONNECTION_REFUSED: 408,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
};

export const resultMiddleware = (<T extends {}>({
  status,
  data,
}: {
  status: number;
  data: T;
}): { status: number; data: T } => ({ status, data }));

export const errorMiddleware = <T extends any>(debug): IResultWithStatus<T> => (debug && debug.response
  ? debug.response
  : {
    status: HTTP_RESPONSES.CONNECTION_REFUSED,
    data: {},
    debug,
    error: 'Ошибка сети',
  });

export const configWithToken = (
  token: string,
  config: AxiosRequestConfig = {},
): AxiosRequestConfig => ({
  ...config,
  headers: { ...(config.headers || {}), Authorization: `${token}` },
});