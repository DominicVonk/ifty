export function checkStartsWith(input: string, value: string) {
  return typeof input === 'string' && typeof value === 'string' && input.startsWith(value);
}
