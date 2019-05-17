import { Action } from 'redux';
import { AxiosRequestConfig } from 'axios';
import { Omit } from 'utility-types';
import {
  StartSequenceTransformer,
  DoneSequenceTransformer,
} from './sequenceTransformers';

export type BailoutFunction<TState = any> = (state: TState) => boolean;

export interface SequenceTransformers<
  TState = any,
  TResponse = any,
  TAction = ActionWithHttpRequest,
  TResult = any
> {
  start?: StartSequenceTransformer<TState, TAction, TResult>;
  failure?: DoneSequenceTransformer<TResponse, TState, TAction, TResult>;
  success?: DoneSequenceTransformer<TResponse, TState, TAction, TResult>;
}

export interface HttpRequestMeta<
  TState = any,
  TResponse = any,
  TAction = ActionWithHttpRequest,
  TResult = any
> extends Omit<AxiosRequestConfig, 'data' | 'url'> {
  bailout?: boolean | BailoutFunction<TState>;
  data?: ((state: TState) => any) | any;
  sequences?: SequenceTransformers<TState, TResponse, TAction, TResult>;
  url: ((state: TState) => string) | string;
}

export interface ActionWithHttpRequest extends Action {
  meta: {
    httpRequest: HttpRequestMeta;
  };
}
