import { AxiosRequestConfig } from 'axios';

type DisallowedAxiosConfigFields =
  | 'cancelToken'
  | 'transformRequest'
  | 'transformResponse'
  | 'validateStatus';

export type ExtendedAxiosRequestConfigOptions =
  | 'data'
  | 'headers'
  | 'params'
  | 'url';

export type HttpRequestHeaders = { [key: string]: any } | undefined;

export type HttpRequestConfigFn<TState = any, TResult = any> = (
  state: TState,
) => TResult;

type AllowedHttpRequestConfig = Omit<
  Omit<AxiosRequestConfig, DisallowedAxiosConfigFields>,
  ExtendedAxiosRequestConfigOptions
>;
export interface HttpRequestConfig<TState = any>
  extends AllowedHttpRequestConfig {
  data?: any | HttpRequestConfigFn<TState, any>;
  headers?:
    | HttpRequestHeaders
    | HttpRequestConfigFn<TState, HttpRequestHeaders>;
  params?: any | HttpRequestConfigFn<TState, any>;
  url?: string | HttpRequestConfigFn<TState, string>;
}
