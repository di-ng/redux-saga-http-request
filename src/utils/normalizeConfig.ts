import { HttpRequestMeta } from '../types/actionMeta';
import { AxiosRequestConfig } from 'axios';

export function normalizeAxiosRequestConfigFromActionMeta<TState = any>(
  state: TState,
  actionHttpRequestMeta: HttpRequestMeta,
): AxiosRequestConfig {
  const { data, url } = actionHttpRequestMeta;
  let finalData = typeof data === 'function' ? data(state) : data;
  let finalUrl = typeof url === 'function' ? url(state) : url;
  return {
    ...actionHttpRequestMeta,
    data: finalData,
    url: finalUrl,
  };
}
