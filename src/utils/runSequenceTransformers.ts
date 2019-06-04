import { AnyAction } from 'redux';
import { HttpResponse } from '../types/httpResponse';
import {
  NormalizedSequenceTransformersMap,
  SequenceTransformerSequence,
} from '../types/sequenceTransformers';
import { keys } from './objectKeys';

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

  const transformerArgs =
    sequence !== 'start' ? [response, state, action] : [state, action];

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
