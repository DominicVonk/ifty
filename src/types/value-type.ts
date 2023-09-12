export type ValueType<I> =
  | I
  | RegExp
  | ((input: I) => boolean)
  | { in: I[] | string }
  | { startsWith: string }
  | { endsWith: string }
  | { contains: string }
  | { range: [number, number] }
  | { instanceof: NewableFunction }
  | { partial: any }
  | { deep: any }
  | { gte: number }
  | { gt: number }
  | { lte: number }
  | { lt: number }
  | { like: any }
  | { keyExists: string };

export type ValueTypeAsync<I> = ValueType<I> | ((input: I) => Promise<boolean>);
