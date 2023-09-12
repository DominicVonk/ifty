import { asyncChecker, checker } from './lib/checker';
import { ValueType, ValueTypeAsync } from './types/value-type';

export function ifty<T, I>(
  input: I,
  value: ValueType<I>,
  result: (...args: any) => T,
  elseResult?: () => T,
): T | undefined {
  const checkerResult = checker(input, value);
  if (
    (typeof checkerResult === 'boolean' && checkerResult) ||
    (typeof checkerResult === 'object' && Array.isArray(checkerResult) && checkerResult[0])
  ) {
    const params: any[] = Array.isArray(checkerResult) ? checkerResult.slice(1) : [];

    return result(...params);
  }
  return elseResult ? elseResult() : undefined;
}

export async function iftyAsync<T, I>(
  input: I,
  value: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>,
  result: (...args: any) => Promise<T> | T,
  elseResult?: () => Promise<T> | T,
): Promise<T | undefined> {
  const checkerResult = await asyncChecker(input, value);
  if (
    (typeof checkerResult === 'boolean' && checkerResult) ||
    (typeof checkerResult === 'object' && Array.isArray(checkerResult) && checkerResult[0])
  ) {
    const params: any[] = Array.isArray(checkerResult) ? checkerResult.slice(1) : [];
    return await result(...params);
  }
  return elseResult ? elseResult() : undefined;
}
