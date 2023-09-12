import { describe, expect, it } from 'vitest';
import { matchAll, matchAllAsync } from '../src/match-all';
describe('match-all', function () {
  it('should match-all the first occurrence', function () {
    expect(
      matchAll('Hello world')
        .when('Hello world', () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all the first occurrence with a function', function () {
    expect(
      matchAll('Hello world')
        .when(
          (input) => input === 'Hello world',
          () => true,
        )
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all the first occurrence with a regex', function () {
    expect(
      matchAll('Hello world')
        .when(/Hello world/, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should not match-all the first occurrence', function () {
    expect(
      matchAll('Hello world')
        .when('Hello', () => true)
        .exec(),
    ).toStrictEqual([]);
  });

  it('should match-all the otherwise', function () {
    expect(
      matchAll('Hello world')
        .when('Hello', () => true)
        .default(() => false)
        .exec(),
    ).toStrictEqual([false]);
  });

  it('should match-all with in', function () {
    expect(
      matchAll('Hello world')
        .when({ in: ['Hello world'] }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with startsWith', function () {
    expect(
      matchAll('Hello world')
        .when({ startsWith: 'Hello' }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with endsWith', function () {
    expect(
      matchAll('Hello world')
        .when({ endsWith: 'world' }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with contains', function () {
    expect(
      matchAll('Hello world')
        .when({ contains: 'o wo' }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with range', function () {
    expect(
      matchAll(5)
        .when({ range: [1, 10] }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with instanceof', function () {
    expect(
      matchAll(new Error())
        .when({ instanceof: Error }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello world'), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async function', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(
          async (input) => input === 'Hello world',
          async () => true,
        )
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async regex', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve(/Hello world/), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should not match-all with async', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello'), async () => true)
        .exec(),
    ).toStrictEqual([]);
  });

  it('should match-all with async in', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ in: ['Hello world'] }), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async startsWith', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ startsWith: 'Hello' }), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async endsWith', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ endsWith: 'world' }), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async contains', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ contains: 'o wo' }), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async range', async function () {
    expect(
      await matchAllAsync<boolean, number>(5)
        .when(Promise.resolve({ range: [1, 10] }), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async instanceof', async function () {
    expect(
      await matchAllAsync<boolean, Error>(new Error())
        .when(Promise.resolve({ instanceof: Error }), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all with async', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello world'), async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all else with async', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello'), async () => true)
        .default(async () => false)
        .exec(),
    ).toStrictEqual([false]);
  });

  it('should match-all in array', async function () {
    expect(
      await matchAllAsync<boolean, string>('Hello world')
        .when({ in: 'Hello world' }, async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all contains array', async function () {
    expect(
      await matchAllAsync<boolean, string[]>(['Hello world'])
        .when({ contains: 'Hello world' }, async () => true)
        .exec(),
    ).toStrictEqual([true]);
  });
  it('should match-all contains array', async function () {
    expect(
      await matchAllAsync<boolean, number>(5)
        .when({ in: 4 as unknown as string }, async () => true)
        .exec(),
    ).toStrictEqual([]);
  });

  it('should match-all contains array', async function () {
    expect(
      await matchAllAsync<boolean, number>(5)
        .when({ contains: 'Hello world' }, async () => true)
        .exec(),
    ).toStrictEqual([]);
  });

  it('should match-all contains array', async function () {
    expect(
      await matchAllAsync<boolean, number>(5)
        .when(Promise.resolve({ contains: 'Hello world' }), async () => true)
        .exec(),
    ).toStrictEqual([]);
  });
  it('should throw when no result is found', () => {
    expect(() =>
      matchAll('Hello world')
        .when('Hello', () => true)
        .throw(new Error('No match-all found'))
        .exec(),
    ).toThrow('No match-all found');
  });

  it('should throw when no result is found with async', async () => {
    await expect(
      matchAllAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello'), async () => true)
        .throw(new Error('No match-all found'))
        .exec(),
    ).rejects.toThrow('No match-all found');
  });

  it('should throw when result is found', () => {
    expect(() =>
      matchAll('Hello world')
        .when('Hello world', () => true)
        .throw(new Error('No match-all found'))
        .exec(),
    ).toThrow('No match-all found');
  });

  it('should throw when result is found with async', async () => {
    expect(
      async () =>
        await matchAllAsync<boolean, string>('Hello world')
          .when(Promise.resolve('Hello world'), async () => true)
          .throw(new Error('No match-all found'))
          .exec(),
    ).rejects.toThrow('No match-all found');
  });

  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1 } }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1, b: 2 } }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1, b: 2, c: 3 } }, () => true)
        .default(() => false)
        .exec(),
    ).toStrictEqual([true, false]);
  });

  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1, b: 2, c: 3 } }, () => true, true)
        .default(() => false)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should not match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1, b: 2, c: 3, d: 4 } }, () => true)
        .exec(),
    ).toStrictEqual([]);
  });

  // partial nested
  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: { c: 3 } })
        .when({ partial: { b: { c: 3 } } }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: { c: 3 } })
        .when({ partial: { a: 1, b: { c: 3 } } }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll({ a: 1, b: { c: 3 } })
        .when({ partial: { a: 1, b: { c: 4 } } }, () => true)
        .exec(),
    ).toStrictEqual([]);
  });

  it('should match-all the first occurrence with partial', function () {
    expect(
      matchAll([{ a: 1 }, { a: 1, b: { c: 3 } }])
        .when({ partial: [{}, { a: 1, b: { c: 3 } }] }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });

  it('should not match-all the first occurrence with deep', function () {
    expect(
      matchAll([{ a: 1 }, { a: 1, b: { c: 3 } }])
        .when({ deep: [{}, { a: 1, b: { c: 4 } }] }, () => true)
        .exec(),
    ).toStrictEqual([]);
  });

  it('should match-all the first occurrence with deep', function () {
    expect(
      matchAll([{ a: 1 }, { a: 1, b: { c: 3 } }])
        .when({ deep: [{ a: 1 }, { a: 1, b: { c: 3 } }] }, () => true)
        .exec(),
    ).toStrictEqual([true]);
  });
});
