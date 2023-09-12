export function checkPartial(input: any, partial: any): false | [true, any] {
  if (typeof input !== 'object' || typeof partial !== 'object') {
    return false;
  }

  for (const key in partial) {
    if (typeof partial[key] === 'object') {
      if (!checkPartial(input[key], partial[key])) {
        return false;
      }
    } else if (input[key] !== partial[key]) {
      return false;
    }
  }

  return [true, input];
}
