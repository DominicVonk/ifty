export function checkContains(input: string, value: string) {
  if (typeof input === 'string' && typeof value === 'string') {
    return input.includes(value);
  }
  if (Array.isArray(input) && typeof input?.[0] === typeof value) {
    return input.includes(value);
  }
  return false;
}
