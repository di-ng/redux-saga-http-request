import { AnyAction } from 'redux';

export type SequenceTransformerSequence = 'start' | 'failure' | 'success';

export type StartSequenceTransformer<
  TState = any,
  TAction = AnyAction,
  TResult = any
> = (state: TState, action: TAction) => TResult;

export type DoneSequenceTransformer<
  TResponse = any,
  TState = any,
  TAction = AnyAction,
  TResult = any
> = (response: TResponse, state: TState, action: TAction) => TResult;

export interface StartSequenceTransformersMap {
  dispatch?: StartSequenceTransformer;
  meta?: StartSequenceTransformer;
  payload?: StartSequenceTransformer;
}

export interface DoneSequenceTransformersMap {
  dispatch?: DoneSequenceTransformer;
  error?: DoneSequenceTransformer;
  meta?: DoneSequenceTransformer;
  payload?: DoneSequenceTransformer;
}

export interface SequenceTransformersMap {
  start?: StartSequenceTransformersMap;
  failure?: DoneSequenceTransformersMap;
  success?: DoneSequenceTransformersMap;
}