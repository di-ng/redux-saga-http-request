import {
  NormalizedSequenceTransformersMap,
  SequenceTransformersMap,
  DoneSequenceTransformersMap,
  DoneSequenceTransformer,
  StartSequenceTransformer,
  StartSequenceTransformersMap,
} from '../types/sequenceTransformers';
import { AnyAction } from 'redux';
import { keys } from './objectKeys';

const DEFAULT_TRANSFOMERS = {
  dispatch: () => true,
  error: (_: any, action: AnyAction) => action.error,
  meta: (_: any, action: AnyAction) => action.meta,
  payload: (_: any, action: AnyAction) => action.payload,
};

export function normalizeSequenceTransformers({
  failure,
  start,
  success,
}: SequenceTransformersMap = {}): NormalizedSequenceTransformersMap {
  return {
    failure: normalizeTransformers<
      NormalizedSequenceTransformersMap['failure']
    >(failure, false),
    start: normalizeTransformers<NormalizedSequenceTransformersMap['start']>(
      start,
      true,
    ),
    success: normalizeTransformers<
      NormalizedSequenceTransformersMap['success']
    >(success, false),
  };
}

function normalizeTransformers<R>(
  sequenceTransformersMap:
    | DoneSequenceTransformersMap
    | StartSequenceTransformersMap = {},
  isStartSequence: boolean,
): R {
  let transformerKeys = keys(DEFAULT_TRANSFOMERS);

  // Remove the error key if the transformers being normalized are for the
  // START sequence
  if (isStartSequence) {
    transformerKeys = transformerKeys.filter(key => key !== 'error');
  }

  return transformerKeys.reduce(
    (normalizedMap, key) => {
      normalizedMap[key] = normalizeTransformer(
        key,
        (sequenceTransformersMap as any)[key],
      );
      return normalizedMap;
    },
    {} as any,
  );
}

function normalizeTransformer(
  key: keyof StartSequenceTransformersMap | keyof DoneSequenceTransformersMap,
  transformer?: DoneSequenceTransformer | StartSequenceTransformer,
) {
  if (transformer === undefined) {
    return DEFAULT_TRANSFOMERS[key];
  }

  // Convert non-function transformers into functions
  // to simplify the API
  if (typeof transformer !== 'function') {
    return () => transformer;
  }

  return transformer;
}
