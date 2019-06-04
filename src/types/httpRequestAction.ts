import { AnyAction } from 'redux';
import { HttpRequestConfig } from './requestConfig';
import { SequenceTransformersMap } from './sequenceTransformers';

type BailoutFn<TState = any> = (
  state: TState,
  prototypeAction: AnyAction,
) => boolean;

export interface HttpRequestActionMeta<TState = any>
  extends HttpRequestConfig<TState> {
  bailout?: boolean | BailoutFn<TState>;
  sequences?: SequenceTransformersMap<TState>;
}

export interface HttpRequestAction extends AnyAction {
  meta: {
    httpRequest: HttpRequestActionMeta;
    [key: string]: any;
  };
}
