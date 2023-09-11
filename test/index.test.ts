import { describe, expect, it } from 'vitest';
import { match, matchAsync } from '../src/index';
describe('match', function () {
  it('should match the first occurrence', function () {
    expect(
      match('Hello world')
        .when('Hello world', () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with a function', function () {
    expect(
      match('Hello world')
        .when(
          (input) => input === 'Hello world',
          () => true,
        )
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with a regex', function () {
    expect(
      match('Hello world')
        .when(/Hello world/, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should not match the first occurrence', function () {
    expect(
      match('Hello world')
        .when('Hello', () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match the otherwise', function () {
    expect(
      match('Hello world')
        .when('Hello', () => true)
        .default(() => false)
        .resolve(),
    ).toBe(false);
  });

  it('should match with in', function () {
    expect(
      match('Hello world')
        .when({ in: ['Hello world'] }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with startsWith', function () {
    expect(
      match('Hello world')
        .when({ startsWith: 'Hello' }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with endsWith', function () {
    expect(
      match('Hello world')
        .when({ endsWith: 'world' }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with contains', function () {
    expect(
      match('Hello world')
        .when({ contains: 'o wo' }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with range', function () {
    expect(
      match(5)
        .when({ range: [1, 10] }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with instanceof', function () {
    expect(
      match(new Error())
        .when({ instanceof: Error }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello world'), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async function', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(
          async (input) => input === 'Hello world',
          async () => true,
        )
        .resolve(),
    ).toBe(true);
  });

  it('should match with async regex', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve(/Hello world/), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should not match with async', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello'), async () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match with async in', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ in: ['Hello world'] }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async startsWith', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ startsWith: 'Hello' }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async endsWith', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ endsWith: 'world' }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async contains', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve({ contains: 'o wo' }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async range', async function () {
    expect(
      await matchAsync<boolean, number>(5)
        .when(Promise.resolve({ range: [1, 10] }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async instanceof', async function () {
    expect(
      await matchAsync<boolean, Error>(new Error())
        .when(Promise.resolve({ instanceof: Error }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello world'), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match else with async', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello'), async () => true)
        .default(async () => false)
        .resolve(),
    ).toBe(false);
  });

  it('should match in array', async function () {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when({ in: 'Hello world' }, async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match contains array', async function () {
    expect(
      await matchAsync<boolean, string[]>(['Hello world'])
        .when({ contains: 'Hello world' }, async () => true)
        .resolve(),
    ).toBe(true);
  });
  it('should match contains array', async function () {
    expect(
      await matchAsync<boolean, number>(5)
        .when({ in: 4 as unknown as string }, async () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match contains array', async function () {
    expect(
      await matchAsync<boolean, number>(5)
        .when({ contains: 'Hello world' }, async () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match contains array', async function () {
    expect(
      await matchAsync<boolean, number>(5)
        .when(Promise.resolve({ contains: 'Hello world' }), async () => true)
        .resolve(),
    ).toBe(undefined);
  });
  it('should throw when no result is found', () => {
    expect(() =>
      match('Hello world')
        .when('Hello', () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).toThrow('No match found');
  });

  it('should throw when no result is found with async', async () => {
    await expect(
      matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello'), async () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).rejects.toThrow('No match found');
  });

  it('should not throw when result is found', () => {
    expect(
      match('Hello world')
        .when('Hello world', () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).toBe(true);
  });

  it('should not throw when result is found with async', async () => {
    expect(
      await matchAsync<boolean, string>('Hello world')
        .when(Promise.resolve('Hello world'), async () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with partial', function () {
    expect(
      match({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1 } }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with partial', function () {
    expect(
      match({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1, b: 2 } }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with partial', function () {
    expect(
      match({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1, b: 2, c: 3 } }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should not match the first occurrence with partial', function () {
    expect(
      match({ a: 1, b: 2, c: 3 })
        .when({ partial: { a: 1, b: 2, c: 3, d: 4 } }, () => true)
        .resolve(),
    ).toBe(undefined);
  });

  // partial nested
  it('should match the first occurrence with partial', function () {
    expect(
      match({ a: 1, b: { c: 3 } })
        .when({ partial: { b: { c: 3 } } }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with partial', function () {
    expect(
      match({ a: 1, b: { c: 3 } })
        .when({ partial: { a: 1, b: { c: 3 } } }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with partial', function () {
    expect(
      match({ a: 1, b: { c: 3 } })
        .when({ partial: { a: 1, b: { c: 4 } } }, () => true)
        .resolve(),
    ).toBe(undefined);
  });
});
