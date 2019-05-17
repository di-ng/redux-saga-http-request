import { Sequence } from 'types/sequence';
import { SequenceTransformersMap } from '../types/sequenceTransformers';

export function runSequenceTransformers(
  sequence: Sequence,
  sequenceTransformers: SequenceTransformersMap,
  action,
  state,
  response,
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
    result.transformedAction = Object.keys(
      nonDispatchSequenceTransformers,
    ).reduce((transformedAction, transformerKey) => {
      const transformer = nonDispatchSequenceTransformers[transformerKey];
      transformedAction[transformerKey] = transformer(...transformerArgs);
      return transformedAction;
    }, action);
  }

  return result;
}
