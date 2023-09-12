import { describe, expect, it } from 'vitest';
import { ifty } from '../src/ifty';
describe('ifty', function () {
  it('should return the result', function () {
    expect(ifty('1', '1', () => true)).toBe(true);
  });

  it('should return undefined', function () {
    expect(ifty('1', '2', () => true)).toBe(undefined);
  });

  it('should return the else result', function () {
    expect(
      ifty(
        '1',
        '2',
        () => true,
        () => false,
      ),
    ).toBe(false);
  });
});
