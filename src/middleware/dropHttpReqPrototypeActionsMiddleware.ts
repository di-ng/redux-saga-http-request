import { Middleware } from 'redux';

export const dropHttpReqPrototypeActionsMiddleware: Middleware = _store => next => action => {
  if (!action.meta || !action.meta.httpRequest) {
    // Only dispatch actions without httpRequest metadata down to the reducers, as this data is only needed
    // for the saga
    return next(action);
  }
};
