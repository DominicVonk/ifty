export function checkIn(input: any, list: any) {
  if (typeof list === 'string' && typeof input === 'string') {
    return list.includes(input);
  }
  if (Array.isArray(list) && typeof list?.[0] === typeof input) {
    return list.includes(input);
  }
  return false;
}
