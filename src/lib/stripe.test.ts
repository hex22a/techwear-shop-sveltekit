import { describe, test, expect, vi } from 'vitest';

import { STRIPE_CONFIG } from '$lib/config';

vi.mock('stripe', () => ({
  __esModule: true,
  default: vi.fn()
}));

describe('stripe', () => {
  test('constructor', async () => {
    // Arrange
    const expectedStripeSecretKey = 'sk_test_1234567890';
    const expectedStripeConfig = STRIPE_CONFIG;
    process.env.STRIPE_SECRET_KEY = expectedStripeSecretKey;

    const MockStripe = (await import('stripe')).default;

    // Act
    await import('./stripe');

    // Assert
    expect(MockStripe).toHaveBeenCalledWith(expectedStripeSecretKey, expectedStripeConfig);
    expect(MockStripe).toHaveBeenCalledTimes(1);
  });
});
