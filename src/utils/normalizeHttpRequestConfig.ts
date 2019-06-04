import { AxiosRequestConfig } from 'axios';
import {
  ExtendedAxiosRequestConfigOptions,
  HttpRequestConfig,
} from '../types/requestConfig';

const EXTENDED_CONFIG_KEYS: ExtendedAxiosRequestConfigOptions[] = [
  'data',
  'headers',
  'params',
  'url',
];

export function normalizeHttpRequestConfig<TState = any>(
  httpRequestConfig: HttpRequestConfig,
  state: TState,
): AxiosRequestConfig {
  return {
    ...httpRequestConfig,
    ...EXTENDED_CONFIG_KEYS.reduce(
      (normalizedExtendedOptions, key) => {
        const extendedOption = httpRequestConfig[key];

        if (typeof extendedOption === 'function') {
          normalizedExtendedOptions[key] = extendedOption(state);
        }

        return normalizedExtendedOptions;
      },
      {} as any,
    ),
  };
}
