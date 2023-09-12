export function checkMethod(input: any, method: (input: any) => any): false | [true, any] {
  const result = typeof method === 'function' && method(input);

  if (!result) {
    return false;
  }

  return [true, result];
}
