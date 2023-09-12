export function checkEndsWith(input: string, value: string) {
  return typeof input === 'string' && typeof value === 'string' && input.endsWith(value);
}
