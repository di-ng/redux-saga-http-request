import { AnyAction } from 'redux';
import { Sequence } from '../types/sequence';

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
