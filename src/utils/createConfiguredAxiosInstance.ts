import axios from 'axios';
import { AxiosInstanceConfig } from '../types/axiosInstanceConfig';

const DEFAULT_CONFIG: Partial<AxiosInstanceConfig> = {};

const REQUIRED_CONFIG = {
  // By always returning true, the response path will always be consistent
  validateStatus: () => true,
};

export function createConfiguredAxiosInstance(
  axiosConfig?: AxiosInstanceConfig,
) {
  return axios.create({
    ...DEFAULT_CONFIG,
    ...axiosConfig,
    ...REQUIRED_CONFIG,
  });
}
