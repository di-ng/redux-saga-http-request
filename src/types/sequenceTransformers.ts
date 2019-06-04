import { AnyAction } from 'redux';
import { DeepRequired } from 'utility-types';
import { HttpResponse } from './httpResponse';

export type SequenceTransformerSequence = 'start' | 'failure' | 'success';

export type StartSequenceTransformer<
  TState = any,
  TResult = any,
  TAction = AnyAction
> = (state: TState, action: TAction) => TResult;

export type DoneSequenceTransformer<
  TState = any,
  TResponseData = any,
  TResult = any,
  TAction = AnyAction
> = (
  response: HttpResponse<TResponseData>,
  state: TState,
  action: TAction,
) => TResult;

export interface StartSequenceTransformersMap<TState = any> {
  dispatch?: StartSequenceTransformer<TState>;
  meta?: StartSequenceTransformer<TState>;
  payload?: StartSequenceTransformer<TState>;
}

export interface DoneSequenceTransformersMap<TState = any> {
  dispatch?: DoneSequenceTransformer<TState>;
  error?: DoneSequenceTransformer<TState>;
  meta?: DoneSequenceTransformer<TState>;
  payload?: DoneSequenceTransformer<TState>;
}

export interface SequenceTransformersMap<TState = any> {
  start?: StartSequenceTransformersMap<TState>;
  failure?: DoneSequenceTransformersMap<TState>;
  success?: DoneSequenceTransformersMap<TState>;
}

export type NormalizedSequenceTransformersMap<TState = any> = DeepRequired<
  SequenceTransformersMap<TState>
>;
