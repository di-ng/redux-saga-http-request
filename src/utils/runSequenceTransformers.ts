import {
  SequenceTransformerSequence,
  NormalizedSequenceTransformersMap,
} from '../types/sequenceTransformers';
import { keys } from './objectKeys';
import { HttpResponse } from '../types/httpResponse';
import { AnyAction } from 'redux';

export function runSequenceTransformers<TState = any>(
  sequence: SequenceTransformerSequence,
  sequenceTransformers: NormalizedSequenceTransformersMap,
  action: AnyAction,
  state: TState,
  response?: HttpResponse,
) {
  const { dispatch, ...nonDispatchSequenceTransformers } = sequenceTransformers[
    sequence
  ];

  const transformerArgs = sequence
    ? [response, state, action]
    : [state, action];

  const shouldDispatch = !!(dispatch as any)(...transformerArgs);
  const result = {
    shouldDispatch,
    transformedAction: action,
  };

  if (shouldDispatch) {
    result.transformedAction = keys(nonDispatchSequenceTransformers).reduce(
      (transformedAction, transformerKey) => {
        const transformer = nonDispatchSequenceTransformers[
          transformerKey
        ] as any;
        transformedAction[transformerKey] = transformer(...transformerArgs);
        return transformedAction;
      },
      action,
    );
  }

  return result;
}
