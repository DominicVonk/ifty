import { describe, expect, it } from 'vitest';
import { ifty, iftyAsync } from '../src/index';
describe('match', function () {
  it('should match the first occurrence', function () {
    expect(
      ifty('Hello world')
        .matches('Hello world', () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with a function', function () {
    expect(
      ifty('Hello world')
        .matches(
          (input) => input === 'Hello world',
          () => true,
        )
        .resolve(),
    ).toBe(true);
  });

  it('should match the first occurrence with a regex', function () {
    expect(
      ifty('Hello world')
        .matches(/Hello world/, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should not match the first occurrence', function () {
    expect(
      ifty('Hello world')
        .matches('Hello', () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match the otherwise', function () {
    expect(
      ifty('Hello world')
        .matches('Hello', () => true)
        .else(() => false)
        .resolve(),
    ).toBe(false);
  });

  it('should match with in', function () {
    expect(
      ifty('Hello world')
        .matches({ in: ['Hello world'] }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with startsWith', function () {
    expect(
      ifty('Hello world')
        .matches({ startsWith: 'Hello' }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with endsWith', function () {
    expect(
      ifty('Hello world')
        .matches({ endsWith: 'world' }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with contains', function () {
    expect(
      ifty('Hello world')
        .matches({ contains: 'o wo' }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with range', function () {
    expect(
      ifty(5)
        .matches({ range: [1, 10] }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with instanceof', function () {
    expect(
      ifty(new Error())
        .matches({ instanceof: Error }, () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve('Hello world'), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async function', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(
          async (input) => input === 'Hello world',
          async () => true,
        )
        .resolve(),
    ).toBe(true);
  });

  it('should match with async regex', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve(/Hello world/), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should not match with async', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve('Hello'), async () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match with async in', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve({ in: ['Hello world'] }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async startsWith', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve({ startsWith: 'Hello' }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async endsWith', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve({ endsWith: 'world' }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async contains', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve({ contains: 'o wo' }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async range', async function () {
    expect(
      await iftyAsync<boolean, number>(5)
        .matches(Promise.resolve({ range: [1, 10] }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async instanceof', async function () {
    expect(
      await iftyAsync<boolean, Error>(new Error())
        .matches(Promise.resolve({ instanceof: Error }), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match with async', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve('Hello world'), async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match else with async', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve('Hello'), async () => true)
        .else(async () => false)
        .resolve(),
    ).toBe(false);
  });

  it('should match in array', async function () {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches({ in: 'Hello world' }, async () => true)
        .resolve(),
    ).toBe(true);
  });

  it('should match contains array', async function () {
    expect(
      await iftyAsync<boolean, string[]>(['Hello world'])
        .matches({ contains: 'Hello world' }, async () => true)
        .resolve(),
    ).toBe(true);
  });
  it('should match contains array', async function () {
    expect(
      await iftyAsync<boolean, number>(5)
        .matches({ in: 4 as unknown as string }, async () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match contains array', async function () {
    expect(
      await iftyAsync<boolean, number>(5)
        .matches({ contains: 'Hello world' }, async () => true)
        .resolve(),
    ).toBe(undefined);
  });

  it('should match contains array', async function () {
    expect(
      await iftyAsync<boolean, number>(5)
        .matches(Promise.resolve({ contains: 'Hello world' }), async () => true)
        .resolve(),
    ).toBe(undefined);
  });
  it('should throw when no result is found', () => {
    expect(() =>
      ifty('Hello world')
        .matches('Hello', () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).toThrow('No match found');
  });

  it('should throw when no result is found with async', async () => {
    await expect(
      iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve('Hello'), async () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).rejects.toThrow('No match found');
  });

  it('should not throw when result is found', () => {
    expect(
      ifty('Hello world')
        .matches('Hello world', () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).toBe(true);
  });

  it('should not throw when result is found with async', async () => {
    expect(
      await iftyAsync<boolean, string>('Hello world')
        .matches(Promise.resolve('Hello world'), async () => true)
        .throw(new Error('No match found'))
        .resolve(),
    ).toBe(true);
  });
});
