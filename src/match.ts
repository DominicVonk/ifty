import { asyncChecker, checker } from './lib/checker';
import {
  AsyncStatements,
  MatchOtherwise,
  MatchOtherwiseAsync,
  MatchWith,
  MatchWithAsync,
  Statements,
} from './types/match';
import { ValueType, ValueTypeAsync } from './types/value-type';

export function match<T, I>(input: I): MatchWith<T, I> {
  const statements: Statements<T, I> = [];
  return {
    when: _matches<T, I>(input, statements),
    default: _else<T, I>(input, statements),
    throw: _throw<T, I>(input, statements),
    exec: () => _resolveStatements<T, I>(input, statements),
  };
}

export function matchAsync<T, I>(input: I | Promise<I>): MatchWithAsync<T, I> {
  const statements: AsyncStatements<T, I> = [];
  return {
    when: _matchesAsync<T, I>(input, statements),
    default: _elseAsync<T, I>(input, statements),
    throw: _throwAsync<T, I>(input, statements),
    exec: () => _resolveStatementsAsync<T, I>(input, statements),
  };
}

function _resolveStatements<T, I>(input: I, statements: Statements<T, I>): T | undefined {
  let result;
  for (const statement of statements) {
    if (statement.isElse) {
      result = statement.result();
      break;
    }
    const checkerResult = checker(input, statement.statement);
    if (
      (typeof checkerResult === 'boolean' && checkerResult) ||
      (typeof checkerResult === 'object' && Array.isArray(checkerResult) && checkerResult[0])
    ) {
      const params: any[] = Array.isArray(checkerResult) ? checkerResult.slice(1) : [];
      result = statement.result(...params);
      break;
    }
  }
  return result;
}

async function _resolveStatementsAsync<T, I>(
  input: I | Promise<I>,
  statements: AsyncStatements<T, I>,
): Promise<T | undefined> {
  let result;
  for (const statement of statements) {
    if (statement.isElse) {
      result = await statement.result();
      break;
    }
    const checkerResult = await asyncChecker(input, statement.statement);
    if (
      (typeof checkerResult === 'boolean' && checkerResult) ||
      (typeof checkerResult === 'object' && Array.isArray(checkerResult) && checkerResult[0])
    ) {
      const params: any[] = Array.isArray(checkerResult) ? checkerResult.slice(1) : [];
      result = await statement.result(...params);
      break;
    }
  }
  return result;
}

function _matches<T, I>(input: I, statements: Statements<T, I>) {
  return function (value: ValueType<I>, result: () => T): MatchWith<T, I> {
    statements.push({ statement: value, result });
    return {
      when: _matches<T, I>(input, statements),
      throw: _throw<T, I>(input, statements),
      default: _else<T, I>(input, statements),
      exec: () => _resolveStatements<T, I>(input, statements),
    };
  };
}

function _matchesAsync<T, I>(input: I | Promise<I>, statements: AsyncStatements<T, I>) {
  return function (
    value: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>,
    result: () => Promise<T> | T,
  ): MatchWithAsync<T, I> {
    statements.push({ statement: value, result });
    return {
      when: _matchesAsync<T, I>(input, statements),
      throw: _throwAsync<T, I>(input, statements),
      default: _elseAsync<T, I>(input, statements),
      exec: () => _resolveStatementsAsync<T, I>(input, statements),
    };
  };
}

function _else<T, I>(input: I, statements: Statements<T, I>) {
  return function (result: () => T): MatchOtherwise<T> {
    statements.push({ statement: undefined, result, isElse: true });
    return {
      exec: () => _resolveStatements<T, I>(input, statements),
    };
  };
}

function _elseAsync<T, I>(input: I | Promise<I>, statements: AsyncStatements<T, any>) {
  return function (result: () => Promise<T> | T): MatchOtherwiseAsync<T> {
    statements.push({ statement: undefined, result, isElse: true });
    return {
      exec: () => _resolveStatementsAsync<T, I>(input, statements),
    };
  };
}

function _throw<T, I>(input: I, statements: Statements<T, I>) {
  return function (error: Error | (() => Error)): MatchOtherwise<T> {
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

function _throwAsync<T, I>(input: I | Promise<I>, statements: AsyncStatements<T, I>) {
  return function (error: Error | (() => Error)): MatchOtherwiseAsync<T> {
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
