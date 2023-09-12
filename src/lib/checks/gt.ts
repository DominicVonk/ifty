export function checkGt(input: number, value: number) {
  return typeof input === 'number' && typeof value === 'number' && input > value;
}
