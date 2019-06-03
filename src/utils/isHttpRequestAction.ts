import { AnyAction } from 'redux';

export function isHttpRequestAction(action: AnyAction): boolean {
  return !!(action && action.meta && action.meta.httpRequest);
}
