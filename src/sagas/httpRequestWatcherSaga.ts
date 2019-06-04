import { AnyAction } from 'redux';
import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';
import { HttpRequestAction } from '../types';
import { isHttpRequestAction } from '../utils/isHttpRequestAction';
import { httpRequestSagaFactory } from './httpRequestSaga';

export type HttpRequestActionMatcher = (action: HttpRequestAction) => boolean;

export function* httpRequestWatcherSaga(
  httpRequestSaga: ReturnType<typeof httpRequestSagaFactory>,
  actionMatcher: HttpRequestActionMatcher = () => true,
): SagaIterator {
  yield takeEvery(
    (action: AnyAction) =>
      isHttpRequestAction(action) && actionMatcher(action as HttpRequestAction),
    httpRequestSaga,
  );
}
