import { SagaIterator } from '@redux-saga/core';
import { AnyAction } from 'redux';
import { call, select } from 'redux-saga/effects';
import { MiddlewareFn } from '../types/middleware';

export function* runMiddlewares<M extends MiddlewareFn>(
  middlewareArray: M[],
  prototypeAction: AnyAction,
  itemToTransform: ReturnType<M>,
): SagaIterator {
  let transformedItem = itemToTransform;

  for (let i = 0; i < middlewareArray.length; i++) {
    const middleware = middlewareArray[i];
    // Get the latest state since the middleware can have side effects
    const state = yield select();
    transformedItem = yield call(
      middleware as any,
      state,
      prototypeAction,
      itemToTransform,
    );
  }

  return transformedItem;
}
