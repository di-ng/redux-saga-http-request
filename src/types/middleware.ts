import { AxiosRequestConfig } from 'axios';
import { AnyAction } from 'redux';
import { SagaIterator } from 'redux-saga';
import { HttpResponse } from './httpResponse';

export type HttpMiddlewareFn<TState = any, TItem = any> = (
  state: TState,
  prototypeAction: AnyAction,
  itemToTransform: TItem,
) => TItem | SagaIterator;

export type RequestMiddlewareFn<TState = any> = HttpMiddlewareFn<
  TState,
  AxiosRequestConfig
>;
export type ResponseMiddlewareFn<TState = any> = HttpMiddlewareFn<
  TState,
  HttpResponse
>;
