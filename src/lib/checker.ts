import { checkContains } from './checks/contains';
import { checkDeep } from './checks/deep';
import { checkEndsWith } from './checks/ends-with';
import { checkGt } from './checks/gt';
import { checkGte } from './checks/gte';
import { checkIn } from './checks/in';
import { checkInstanceOf } from './checks/instance-of';
import { checkKeyExists } from './checks/key-exists';
import { checkLt } from './checks/lt';
import { checkLte } from './checks/lte';
import { checkMethod } from './checks/method';
import { checkPartial } from './checks/partial';
import { checkRange } from './checks/range';
import { checkRegExp } from './checks/regex';
import { checkStartsWith } from './checks/starts-with';

export function checker(input: any, value: any) {
  if (typeof value === 'function') {
    return checkMethod(input, value);
  }
  if (value instanceof RegExp) {
    return checkRegExp(input, value);
  }
  if (typeof value === 'object') {
    if ('in' in value) {
      return checkIn(input, value.in);
    }
    if ('startsWith' in value) {
      return checkStartsWith(input, value.startsWith);
    }
    if ('endsWith' in value) {
      return checkEndsWith(input, value.endsWith);
    }
    if ('contains' in value) {
      return checkContains(input, value.contains);
    }
    if ('range' in value) {
      return checkRange(input, value.range);
    }
    if ('instanceof' in value) {
      return checkInstanceOf(input, value.instanceof);
    }
    if ('partial' in value) {
      return checkPartial(input, value.partial);
    }
    if ('deep' in value) {
      return checkDeep(input, value.deep);
    }
    if ('gte' in value) {
      return checkGte(input, value.gte);
    }
    if ('gt' in value) {
      return checkGt(input, value.gt);
    }
    if ('lte' in value) {
      return checkLte(input, value.lte);
    }
    if ('lt' in value) {
      return checkLt(input, value.lt);
    }
    if ('keyExists' in value) {
      return checkKeyExists(input, value.keyExists);
    }
  }
  return input === value;
}

export async function asyncChecker(input: any, value: any) {
  const inputVal = input instanceof Promise ? await input : input;
  const valueVal = value instanceof Promise ? await value : value;

  return checker(inputVal, valueVal);
}
