import { Sequence } from '../types/sequence';
import { AnyAction } from 'redux';

export function addSequenceToAction(
  sequence: Sequence,
  action: AnyAction,
  hasError: boolean = false,
) {
  return {
    ...action,
    ...(sequence === 'done' ? { error: hasError } : undefined),
    sequence,
  };
}
