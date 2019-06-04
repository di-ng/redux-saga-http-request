import { httpRequestSagaFactory } from './httpRequestSaga';
import { AnyAction } from 'redux';
import { isHttpRequestAction } from '../utils/isHttpRequestAction';
import { takeEvery } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

export type ActionMatcher = (action: AnyAction) => boolean;

export function* httpRequestWatcherSaga(
  httpRequestSaga: ReturnType<typeof httpRequestSagaFactory>,
  actionPattern: ActionMatcher = isHttpRequestAction,
): SagaIterator {
  yield takeEvery(actionPattern, httpRequestSaga);
}
