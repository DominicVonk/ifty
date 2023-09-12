type MatchWith<T, I> = {
  when: (value: ValueType<I>, result: () => T) => MatchWith<T, I>;
  throw: (error: Error | (() => Error)) => MatchOtherwise<T>;
  default: (result: () => T) => MatchOtherwise<T>;
  exec: () => T | undefined;
};

type MatchWithAsync<T, I> = {
  when: (value: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>, result: () => Promise<T> | T) => MatchWithAsync<T, I>;
  throw: (error: Error | (() => Error)) => MatchOtherwiseAsync<T>;
  default: (result: () => Promise<T> | T) => MatchOtherwiseAsync<T>;
  exec: () => Promise<T | undefined>;
};

type MatchOtherwise<T> = {
  exec: () => T | undefined;
};

type MatchOtherwiseAsync<T> = {
  exec: () => Promise<T | undefined>;
};

type ValueType<I> =
  | I
  | RegExp
  | ((input: I) => boolean)
  | { in: I[] | string }
  | { startsWith: string }
  | { endsWith: string }
  | { contains: string }
  | { range: [number, number] }
  | { instanceof: NewableFunction }
  | { partial: any }
  | { deep: any };

type ValueTypeAsync<I> = ValueType<I> | ((input: I) => Promise<boolean>);

type Statement<T, I> = {
  statement?: ValueType<I>;
  isElse?: boolean;
  result: () => T;
};

type Statements<T, I> = Statement<T, I>[];

type AsyncStatement<T, I> = {
  statement?: Promise<ValueTypeAsync<I>> | ValueTypeAsync<I>;
  isElse?: boolean;
  result: () => Promise<T> | T;
};

type AsyncStatements<T, I> = AsyncStatement<T, I>[];

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
    if (_checker(input, statement.statement)) {
      result = statement.result();
      break;
    }
  }
  return result;
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

async function _resolveStatementsAsync<T, I>(
  input: I | Promise<I>,
  statements: AsyncStatements<T, I>,
): Promise<T | undefined> {
  let result;
  for (const statement of statements) {
    if (statement.isElse) {
      result = statement.result();
      break;
    }
    if (await _asyncChecker(input, statement.statement)) {
      result = await statement.result();
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

function _checker(input: any, value: any) {
  if (typeof value === 'function') {
    return _checkMethod(input, value);
  }
  if (value instanceof RegExp) {
    return _checkRegExp(input, value);
  }
  if (typeof value === 'object') {
    if ('in' in value) {
      return _checkIn(input, value.in);
    }
    if ('startsWith' in value) {
      return _checkStartsWith(input, value.startsWith);
    }
    if ('endsWith' in value) {
      return _checkEndsWith(input, value.endsWith);
    }
    if ('contains' in value) {
      return _checkContains(input, value.contains);
    }
    if ('range' in value) {
      return _checkInRange(input, value.range);
    }
    if ('instanceof' in value) {
      return _checkInstanceOf(input, value.instanceof);
    }
    if ('partial' in value) {
      return _checkPartial(input, value.partial);
    }
    if ('deep' in value) {
      return _checkDeep(input, value.deep);
    }
  }
  return input === value;
}

async function _asyncChecker(input: any, value: any) {
  const inputVal = input instanceof Promise ? await input : input;
  const valueVal = value instanceof Promise ? await value : value;

  return _checker(inputVal, valueVal);
}

function _checkInstanceOf(input: any, classConstructor: NewableFunction) {
  return typeof input === 'object' && input instanceof classConstructor;
}

function _checkInRange(input: number, range: [number, number]) {
  return typeof input === 'number' && input >= range[0] && input <= range[1];
}

function _checkMethod(input: any, method: (input: any) => boolean) {
  return typeof method === 'function' && method(input);
}

function _checkIn(input: any, list: any) {
  if (typeof list === 'string' && typeof input === 'string') {
    return list.includes(input);
  }
  if (Array.isArray(list) && typeof list?.[0] === typeof input) {
    return list.includes(input);
  }
  return false;
}

function _checkContains(input: string, value: string) {
  if (typeof input === 'string' && typeof value === 'string') {
    return input.includes(value);
  }
  if (Array.isArray(input) && typeof input?.[0] === typeof value) {
    return input.includes(value);
  }
  return false;
}

function _checkRegExp(input: any, regex: RegExp) {
  return typeof input === 'string' && regex instanceof RegExp && regex.test(input);
}

function _checkStartsWith(input: string, value: string) {
  return typeof input === 'string' && typeof value === 'string' && input.startsWith(value);
}

function _checkEndsWith(input: string, value: string) {
  return typeof input === 'string' && typeof value === 'string' && input.endsWith(value);
}

// check partial nested object
function _checkPartial(input: any, partial: any) {
  if (typeof input !== 'object' || typeof partial !== 'object') {
    return false;
  }

  for (const key in partial) {
    if (typeof partial[key] === 'object') {
      if (!_checkPartial(input[key], partial[key])) {
        return false;
      }
    } else if (input[key] !== partial[key]) {
      return false;
    }
  }

  return true;
}

// check deep if the objects are the same, same as for arrays
function _checkDeep(input: any, value: any) {
  if (typeof input !== 'object' || typeof value !== 'object') {
    if (typeof input === typeof value) {
      return input === value;
    }
    return false;
  }

  if (Object.keys(input).length !== Object.keys(value).length) {
    return false;
  }

  for (const key in value) {
    if (typeof value[key] === 'object') {
      if (!_checkDeep(input[key], value[key])) {
        return false;
      }
    } else if (input[key] !== value[key]) {
      return false;
    }
  }

  return true;
}
