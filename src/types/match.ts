import { ValueType, ValueTypeAsync } from './value-type';

export type MatchWith<T, I> = {
  when: (value: ValueType<I>, result: (...args: any) => T) => MatchWith<T, I>;
  throw: (error: Error | (() => Error)) => MatchOtherwise<T>;
  default: (result: () => T) => MatchOtherwise<T>;
  exec: () => T | undefined;
};

export type MatchWithAsync<T, I> = {
  when: (
    value: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>,
    result: (...args: any) => Promise<T> | T,
  ) => MatchWithAsync<T, I>;
  throw: (error: Error | (() => Error)) => MatchOtherwiseAsync<T>;
  default: (result: () => Promise<T> | T) => MatchOtherwiseAsync<T>;
  exec: () => Promise<T | undefined>;
};

export type MatchOtherwise<T> = {
  exec: () => T | undefined;
};

export type MatchOtherwiseAsync<T> = {
  exec: () => Promise<T | undefined>;
};

export type Statement<T, I> = {
  statement?: ValueType<I>;
  isElse?: boolean;
  result: (...args: any) => T;
};

export type Statements<T, I> = Statement<T, I>[];

export type AsyncStatement<T, I> = {
  statement?: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>;
  isElse?: boolean;
  result: (...args: any) => Promise<T> | T;
};

export type AsyncStatements<T, I> = AsyncStatement<T, I>[];
