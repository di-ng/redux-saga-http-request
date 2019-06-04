import { AnyAction } from 'redux';
import { AxiosRequestConfig } from 'axios';
import { HttpResponse } from './httpResponse';
import { SagaIterator } from '@redux-saga/core';

export interface MiddlewareFn<TState = any, TItem = any> {
  (state: TState, prototypeAction: AnyAction, itemToTransform: TItem):
    | TItem
    | SagaIterator;
}

export type RequestMiddlewareFn<TState = any> = MiddlewareFn<
  TState,
  AxiosRequestConfig
>;
export type ResponseMiddlewareFn<TState = any> = MiddlewareFn<
  TState,
  HttpResponse
>;
