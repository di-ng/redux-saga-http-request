import { AxiosRequestConfig } from 'axios';

type AllowedAxiosInstanceConfigFields =
  | 'adapter'
  | 'auth'
  | 'baseURL'
  | 'data'
  | 'headers'
  | 'httpAgent'
  | 'httpsAgent'
  | 'maxContentLength'
  | 'maxRedirects'
  | 'method'
  | 'onDownloadProgress'
  | 'onUploadProgress'
  | 'params'
  | 'paramsSerializer'
  | 'proxy'
  | 'responseType'
  | 'timeout'
  | 'withCredentials'
  | 'xsrfCookieName'
  | 'xsrfHeaderName';

export type AxiosInstanceConfig = Pick<
  AxiosRequestConfig,
  AllowedAxiosInstanceConfigFields
>;
