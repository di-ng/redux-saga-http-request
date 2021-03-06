import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, cancelled, put, select } from 'redux-saga/effects';
import { HttpRequest } from '../models/HttpRequest';
import { HttpRequestAction } from '../types/httpRequestAction';
import { HttpResponse } from '../types/httpResponse';
import { RequestMiddlewareFn, ResponseMiddlewareFn } from '../types/middleware';
import { addSequenceToAction } from '../utils/addSequenceToAction';
import { isHttpRequestAction } from '../utils/isHttpRequestAction';
import { normalizeHttpRequestConfig } from '../utils/normalizeHttpRequestConfig';
import { normalizeSequenceTransformers } from '../utils/normalizeSequenceTransformers';
import { runMiddlewares } from '../utils/runMiddlewares';
import { runSequenceTransformers } from '../utils/runSequenceTransformers';

export function httpRequestSagaFactory(
  configuredAxiosInstance: AxiosInstance,
  requestMiddlewares: RequestMiddlewareFn[] = [],
  responseMiddlewares: ResponseMiddlewareFn[] = [],
) {
  return function* httpRequestSaga(action: HttpRequestAction): SagaIterator {
    // Throw error on non-http request actions
    if (isHttpRequestAction(action)) {
      throw new Error(
        `[redux-saga-http-request] Action of type='${(action && action.type) ||
          'UNKNOWN'}' is not an HTTP Request action.`,
      );
    }

    // normalize action
    const {
      meta: { httpRequest: httpRequestMeta, ...otherMeta },
    } = action;
    const {
      bailout,
      sequences: sequenceTransformers,
      ...httpRequestConfig
    } = httpRequestMeta;

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
    const finalRequestConfig: AxiosRequestConfig = yield call(
      runMiddlewares,
      requestMiddlewares,
      actionWithoutHttpRequestMeta,
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
    const finalResponse: HttpResponse = yield call(
      runMiddlewares,
      responseMiddlewares,
      actionWithoutHttpRequestMeta,
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

function* makeHttpRequest(httpRequest: HttpRequest): SagaIterator {
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
