export function checkDeep(input: any, value: any): false | [true, ...any] {
  if (typeof input !== 'object' || typeof value !== 'object') {
    if (typeof input === typeof value && input === value) {
      return [true, input];
    }
    return false;
  }

  if (Object.keys(input).length !== Object.keys(value).length) {
    return false;
  }

  for (const key in value) {
    if (typeof value[key] === 'object') {
      if (!checkDeep(input[key], value[key])) {
        return false;
      }
    } else if (input[key] !== value[key]) {
      return false;
    }
  }

  return [true, input];
}
