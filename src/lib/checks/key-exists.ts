export function checkKeyExists(input: any, key: string): false | [true, any] {
  if (typeof input !== 'object' || typeof key !== 'string') {
    return false;
  }

  const keys = key.split('.');
  let value = input;

  for (const key of keys) {
    if (typeof value !== 'object' || !(key in value)) {
      return false;
    }
    value = value[key];
  }

  return [true, value];
}
