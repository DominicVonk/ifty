import { AsyncStatement, Statement } from './match';
import { ValueType, ValueTypeAsync } from './value-type';

export type MatchAllWith<T, I> = {
  when: (value: ValueType<I>, result: (...args: any) => T, last?: boolean) => MatchAllWith<T, I>;
  throw: (error: Error | (() => Error)) => MatchAllOtherwise<T>;
  default: (result: () => T) => MatchAllOtherwise<T>;
  exec: () => T[];
};

export type MatchAllWithAsync<T, I> = {
  when: (
    value: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>,
    result: (...args: any) => Promise<T> | T,
    last?: boolean,
  ) => MatchAllWithAsync<T, I>;
  throw: (error: Error | (() => Error)) => MatchAllOtherwiseAsync<T>;
  default: (result: () => Promise<T> | T) => MatchAllOtherwiseAsync<T>;
  exec: () => Promise<T[]>;
};

export type MatchAllOtherwise<T> = {
  exec: () => T[];
};

export type MatchAllOtherwiseAsync<T> = {
  exec: () => Promise<T[]>;
};
export type MatchAllStatement<T, I> = Statement<T, I> & {
  end?: boolean;
};

export type MatchAllStatements<T, I> = MatchAllStatement<T, I>[];

export type AsyncMatchAllStatement<T, I> = AsyncStatement<T, I> & {
  end?: boolean;
};

export type AsyncMatchAllStatements<T, I> = AsyncMatchAllStatement<T, I>[];
