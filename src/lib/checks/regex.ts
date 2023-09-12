export function checkRegExp(input: any, regex: RegExp): false | [true, ...RegExpExecArray] {
  const matches = typeof input === 'string' && regex instanceof RegExp && regex.test(input);
  if (matches) {
    const regexResult = regex.exec(input)!;
    return [true, ...regexResult];
  }
  return false;
}
