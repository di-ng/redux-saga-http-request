import { select, put, call, cancelled } from 'redux-saga/effects';
import { isHttpRequestAction } from '../utils/isHttpRequestAction';
import { runSequenceTransformers } from '../utils/runSequenceTransformers';
import { SagaIterator } from '@redux-saga/core';
import { addSequenceToAction } from '../utils/addSequenceToAction';
import { HttpRequest } from '../models/HttpRequest';
import { HttpResponse } from '../types/response';
import { AxiosInstance } from 'axios';
import { normalizeSequenceTransformers } from '../utils/normalizeSequenceTransformers';
import { normalizeHttpRequestConfig } from '../utils/normalizeHttpRequestConfig';

export function httpRequestSagaFactory(
  configuredAxiosInstance: AxiosInstance,
  requestMiddlewares = [],
  responseMiddlewares = [],
) {
  return function* httpRequestSaga(action): SagaIterator {
    // Throw error on non-http request actions
    if (isHttpRequestAction(action)) {
      throw new Error(
        `[redux-saga-http-request] Action of type='${(action && action.type) ||
          'UNKNOWN'}' is not an HTTP Request action.`,
      );
    }

    // normalize action
    const {
      meta: { httpRequest, ...otherMeta },
    } = action;
    const { bailout, sequenceTransformers, ...httpRequestConfig } = httpRequest;

    // Remove the HTTP Request meta to avoid transformation
    // inside of the sequence transformers
    const actionWithoutHttpRequestMeta = {
      ...action,
      meta: otherMeta,
    };

    // Bailout of the saga if needed
    if (
      (typeof bailout === 'function' &&
        bailout(yield select(), actionWithoutHttpRequestMeta)) ||
      bailout === true
    ) {
      return;
    }

    // normalize sequence transformers
    const normalizedSequenceTransformers = normalizeSequenceTransformers(
      sequenceTransformers,
    );

    // Run START sequence transformers
    const {
      shouldDispatch: shouldDispatchStart,
      transformedAction: startAction,
    } = runSequenceTransformers(
      'start',
      normalizedSequenceTransformers,
      yield select(),
      actionWithoutHttpRequestMeta,
    );

    // Dispatch START
    if (shouldDispatchStart) {
      yield put(addSequenceToAction('start', startAction));
    }

    // normalize the request config
    const normalizedHttpRequestConfig = normalizeHttpRequestConfig(
      httpRequestConfig,
      yield select(),
    );

    // run request middleware
    const finalRequestConfig = yield call(
      runMiddlewares,
      requestMiddlewares,
      normalizedHttpRequestConfig,
    );

    // make http request
    const httpRequest = yield call(
      [HttpRequest, 'create'],
      configuredAxiosInstance,
      finalRequestConfig,
    );

    let response;
    try {
      response = yield call(makeHttpRequest, httpRequest);
    } catch (e) {
      response = {
        data: e,
        ok: false,
        status: -1,
        statusText: 'ERROR',
      } as HttpResponse<Error>;
    }

    // run response middleware
    const finalResponse = yield call(
      runMiddlewares,
      responseMiddlewares,
      response,
    );
    const { ok } = finalResponse;

    // Run DONE sequence transformers
    const {
      shouldDispatch: shouldDispatchDone,
      transformedAction: doneAction,
    } = runSequenceTransformers(
      ok ? 'success' : 'failure',
      normalizedSequenceTransformers,
      yield select(),
      actionWithoutHttpRequestMeta,
      finalResponse,
    );

    if (shouldDispatchDone) {
      yield put(addSequenceToAction('done', doneAction, !ok));
    }
  };
}

function* makeHttpRequest(httpRequest: HttpRequest) {
  try {
    return yield call([httpRequest, 'send']);
  } catch (e) {
    throw e;
  } finally {
    if (yield cancelled()) {
      yield call([httpRequest, 'cancel']);
    }
  }
}
