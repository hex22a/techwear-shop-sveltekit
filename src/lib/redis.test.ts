import { describe, test, expect, beforeEach, beforeAll, afterAll, vi, type Mock } from 'vitest';

import { REDIS_LOCAL_URL } from '$lib/constants';

describe('redis', () => {
  let MockRedis: Mock;
  const expectedRedis = {};

  beforeEach(() => {
    vi.resetModules();
    delete global.redis;
    delete process.env.REDIS_URL;

    MockRedis = vi.fn(function () {
      return expectedRedis;
    });

    vi.doMock('ioredis', () => ({
      __esModule: true,
      default: MockRedis
    }));

    MockRedis.mockClear();
  });

  describe('production environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      process.env.NODE_ENV = originalNodeEnv;
    });

    test('process.env.REDIS_URL is not present', async () => {
      // Arrange
      const expectedRedisUrl = REDIS_LOCAL_URL;

      // Act
      const { default: actualRedis } = await import('./redis');

      // Assert
      expect(actualRedis).toBeDefined();
      expect(actualRedis).toEqual(expectedRedis);
      expect(global.redis).toBeUndefined();
      expect(MockRedis).toHaveBeenCalledWith(expectedRedisUrl);
    });

    test('process.env.REDIS_URL is present', async () => {
      // Arrange
      const expectedRedisUrl = 'redis://default:1234567890@redis-cloud.com:1122';
      process.env.REDIS_URL = expectedRedisUrl;

      // Act
      const { default: actualRedis } = await import('./redis');

      // Assert
      expect(actualRedis).toBeDefined();
      expect(actualRedis).toEqual(expectedRedis);
      expect(global.redis).toBeUndefined();
      expect(MockRedis).toHaveBeenCalledWith(expectedRedisUrl);
    });
  });

  describe('singleton in non-production environments to avoid multiple connections in development (Hot Reload issue)', () => {
    describe('first import', () => {
      test('process.env.REDIS_URL is not present', async () => {
        // Arrange
        const expectedRedisUrl = REDIS_LOCAL_URL;

        // Act
        const { default: actualRedis } = await import('./redis');

        // Assert
        expect(actualRedis).toBeDefined();
        expect(actualRedis).toEqual(expectedRedis);
        expect(global.redis).toEqual(expectedRedis);
        expect(MockRedis).toHaveBeenCalledWith(expectedRedisUrl);
      });

      test('process.env.REDIS_URL is present', async () => {
        // Arrange
        const expectedRedisUrl = 'redis://default:1234567890@redis-cloud.com:1122';
        process.env.REDIS_URL = expectedRedisUrl;

        // Act
        const { default: actualRedis } = await import('./redis');

        // Assert
        expect(actualRedis).toBeDefined();
        expect(actualRedis).toEqual(expectedRedis);
        expect(global.redis).toEqual(expectedRedis);
        expect(MockRedis).toHaveBeenCalledWith(expectedRedisUrl);
      });
    });

    test('consecutive imports', async () => {
      // Arrange
      const { default: expectedImportedRedis } = await import('./redis');

      // Act
      const { default: actualRedis } = await import('./redis');

      // Assert
      expect(actualRedis).toBeDefined();
      expect(actualRedis).toEqual(expectedImportedRedis);
      expect(global.redis).toEqual(expectedImportedRedis);
    });
  });
});
