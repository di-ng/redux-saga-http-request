import { AxiosRequestConfig, AxiosInstance } from 'axios';
import { call, cancelled } from 'redux-saga/effects';
import { HttpRequest } from '../models/HttpRequest';

export default function* makeHttpRequest(
  myAxios: AxiosInstance,
  config: AxiosRequestConfig,
) {
  const httpRequest = HttpRequest.create(myAxios, config);
  try {
    return yield call([httpRequest, httpRequest.request]);
  } finally {
    if (yield cancelled()) {
      yield call([httpRequest, httpRequest.cancel]);
    }
  }
}
