import { asyncChecker, checker } from './lib/checker';
import {
  AsyncMatchAllStatements,
  MatchAllOtherwise,
  MatchAllOtherwiseAsync,
  MatchAllStatements,
  MatchAllWith,
  MatchAllWithAsync,
} from './types/match-all';
import { ValueType, ValueTypeAsync } from './types/value-type';

export function matchAll<T, I>(input: I): MatchAllWith<T, I> {
  const statements: MatchAllStatements<T, I> = [];
  return {
    when: _matches<T, I>(input, statements),
    default: _else<T, I>(input, statements),
    throw: _throw<T, I>(input, statements),
    exec: () => _resolveStatements<T, I>(input, statements),
  };
}

export function matchAllAsync<T, I>(input: I | Promise<I>): MatchAllWithAsync<T, I> {
  const statements: AsyncMatchAllStatements<T, I> = [];
  return {
    when: _matchesAsync<T, I>(input, statements),
    default: _elseAsync<T, I>(input, statements),
    throw: _throwAsync<T, I>(input, statements),
    exec: () => _resolveStatementsAsync<T, I>(input, statements),
  };
}

function _resolveStatements<T, I>(input: I, statements: MatchAllStatements<T, I>): T[] {
  let results: T[] = [];

  for (const statement of statements) {
    if (statement.isElse) {
      results.push(statement.result());
      break;
    }
    const checkerResult = checker(input, statement.statement);
    if (
      (typeof checkerResult === 'boolean' && checkerResult) ||
      (typeof checkerResult === 'object' && Array.isArray(checkerResult) && checkerResult[0])
    ) {
      const params: any[] = Array.isArray(checkerResult) ? checkerResult.slice(1) : [];
      results.push(statement.result(...params));
      if (statement.end) {
        break;
      }
    }
  }

  return results;
}

async function _resolveStatementsAsync<T, I>(
  input: I | Promise<I>,
  statements: AsyncMatchAllStatements<T, I>,
): Promise<T[]> {
  let results: T[] = [];

  for (const statement of statements) {
    if (statement.isElse) {
      results.push(await statement.result());
      break;
    }
    const checkerResult = await asyncChecker(input, statement.statement);
    if (
      (typeof checkerResult === 'boolean' && checkerResult) ||
      (typeof checkerResult === 'object' && Array.isArray(checkerResult) && checkerResult[0])
    ) {
      const params: any[] = Array.isArray(checkerResult) ? checkerResult.slice(1) : [];
      results.push(await statement.result(...params));
      if (statement.end) {
        break;
      }
    }
  }

  return results;
}

function _matches<T, I>(input: I, statements: MatchAllStatements<T, I>) {
  return function (value: ValueType<I>, result: () => T, last?: boolean): MatchAllWith<T, I> {
    statements.push({ statement: value, result, end: last || false });
    return {
      when: _matches<T, I>(input, statements),
      throw: _throw<T, I>(input, statements),
      default: _else<T, I>(input, statements),
      exec: () => _resolveStatements<T, I>(input, statements),
    };
  };
}

function _matchesAsync<T, I>(input: I | Promise<I>, statements: AsyncMatchAllStatements<T, I>) {
  return function (
    value: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>,
    result: () => Promise<T> | T,
    last?: boolean,
  ): MatchAllWithAsync<T, I> {
    statements.push({ statement: value, result, end: last || false });
    return {
      when: _matchesAsync<T, I>(input, statements),
      throw: _throwAsync<T, I>(input, statements),
      default: _elseAsync<T, I>(input, statements),
      exec: () => _resolveStatementsAsync<T, I>(input, statements),
    };
  };
}

function _else<T, I>(input: I, statements: MatchAllStatements<T, I>) {
  return function (result: () => T): MatchAllOtherwise<T> {
    statements.push({ statement: undefined, result, isElse: true });
    return {
      exec: () => _resolveStatements<T, I>(input, statements),
    };
  };
}

function _elseAsync<T, I>(input: I | Promise<I>, statements: AsyncMatchAllStatements<T, any>) {
  return function (result: () => Promise<T> | T): MatchAllOtherwiseAsync<T> {
    statements.push({ statement: undefined, result, isElse: true });
    return {
      exec: () => _resolveStatementsAsync<T, I>(input, statements),
    };
  };
}

function _throw<T, I>(input: I, statements: MatchAllStatements<T, I>) {
  return function (error: Error | (() => Error)): MatchAllOtherwise<T> {
    statements.push({
      statement: undefined,
      result: () => {
        throw error;
      },
      isElse: true,
    });
    return {
      exec: () => _resolveStatements<T, I>(input, statements),
    };
  };
}

function _throwAsync<T, I>(input: I | Promise<I>, statements: AsyncMatchAllStatements<T, I>) {
  return function (error: Error | (() => Error)): MatchAllOtherwiseAsync<T> {
    statements.push({
      statement: undefined,
      result: () => {
        throw error;
      },
      isElse: true,
    });
    return {
      exec: () => _resolveStatementsAsync<T, I>(input, statements),
    };
  };
}
