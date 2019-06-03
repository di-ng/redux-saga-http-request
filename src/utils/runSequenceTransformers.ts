import { SequenceTransformerSequence } from '../types/sequenceTransformers';
import { keys } from './objectKeys';
import { HttpResponse } from '../types/response';

export function runSequenceTransformers(
  sequence: SequenceTransformerSequence,
  sequenceTransformers,
  action,
  state,
  response?: HttpResponse,
) {
  const { dispatch, ...nonDispatchSequenceTransformers } = sequenceTransformers[
    sequence
  ];

  const transformerArgs = sequence
    ? [response, state, action]
    : [state, action];

  const shouldDispatch = !!dispatch(...transformerArgs);
  const result = {
    shouldDispatch,
    transformedAction: action,
  };

  if (shouldDispatch) {
    result.transformedAction = keys(nonDispatchSequenceTransformers).reduce(
      (transformedAction, transformerKey) => {
        const transformer = nonDispatchSequenceTransformers[transformerKey];
        transformedAction[transformerKey] = transformer(...transformerArgs);
        return transformedAction;
      },
      action,
    );
  }

  return result;
}
