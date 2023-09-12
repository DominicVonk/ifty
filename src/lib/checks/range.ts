export function checkRange(input: number, range: [number, number]): [true, number] | false {
  const inRange = typeof input === 'number' && input >= range[0] && input <= range[1];
  if (inRange) {
    return [true, input];
  }
  return false;
}
