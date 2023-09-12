export function checkInstanceOf(input: any, classConstructor: NewableFunction) {
  return typeof input === 'object' && input instanceof classConstructor;
}
