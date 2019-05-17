import { SagaIterator } from 'redux-saga';
import { AxiosInstanceConfig } from '../types/axiosInstanceConfig';
import { createConfiguredAxiosInstance } from '../utils/createConfiguredAxiosInstance';
import { ActionWithHttpRequest } from '../types/actionMeta';
import { select, put, call } from 'redux-saga/effects';
import makeHttpRequest from './makeHttpRequest';
import { normalizeAxiosRequestConfigFromActionMeta } from '../utils/normalizeConfig';

export default function makeHttpRequestSaga(
  axiosInstanceConfig: AxiosInstanceConfig = {},
) {
  const myAxios = createConfiguredAxiosInstance(axiosInstanceConfig);

  return function* httpRequestSaga(
    action: ActionWithHttpRequest,
  ): SagaIterator | never {
    if (!action || !action.meta || !action.meta.httpRequest) {
      throw new Error(
        '[redux-saga-http-request] Action missing `meta.httpRequest` data',
      );
    }
    const { bailout, sequences, method } = action.meta.httpRequest;
    if (
      bailout === true ||
      (typeof bailout === 'function' && bailout(yield select()))
    ) {
      return;
    }

    const {
      start: startSeq,
      success: successSq,
      failure: failureSq,
    } = sequences; // TODO normalize and apply default transformers
    if (startSeq.dispatch !== false) {
      yield put(
        actionForSequence('start', startSeq, action, yield select(), method),
      );
    }

    // Make the HTTP request
    const requestConfig = normalizeAxiosRequestConfigFromActionMeta(
      yield select(),
      action.meta.httpRequest,
    );
    const httpResponse = yield call(makeHttpRequest, myAxios, requestConfig);

    const { ok } = httpResponse;
    if (
      (ok && successSq.dispatch !== false) ||
      (!ok && failureSq.dispatch !== false)
    ) {
      const seq = ok ? 'success' : 'failure';
      const seqData = ok ? successSq : failureSq;
      yield put(
        actionForSequence(
          seq,
          seqData,
          action,
          yield select(),
          method,
          httpResponse,
        ),
      );
    }

    return httpResponse;
  };
}
