import makeHttpRequestSaga from './httpRequestSaga';
import { Pattern, SagaIterator } from '@redux-saga/types';
import { takeEvery } from 'redux-saga/effects';
import { AnyAction } from 'redux';

const DEFAULT_TAKE_ACTION_PATTERN = (action: AnyAction) =>
  action.meta && action.meta.httpRequest;

export default function* httpRequestWatcherSaga(
  httpRequestSaga: ReturnType<typeof makeHttpRequestSaga>,
  takeActionPattern: Pattern<AnyAction> = DEFAULT_TAKE_ACTION_PATTERN,
): SagaIterator {
  yield takeEvery(takeActionPattern, httpRequestSaga);
}
