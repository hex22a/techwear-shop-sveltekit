import { describe, test, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import type { Mock } from 'vitest';

import {
  addToCart,
  type AddToCartFormState,
  orderProducts,
  type OrderProductsFormState,
  submitReview,
  type SubmitReviewFormState
} from './actions';
import { type ZodFlattenedError, ZodError } from 'zod';
import {
  ADD_TO_CART_MISSING_FIELDS_ERROR_MESSAGE,
  ORDER_PRODUCTS_MISSING_FIELDS_ERROR_MESSAGE,
  ADD_REVIEW_MISSING_FIELDS_ERROR_MESSAGE,
  FAILED_TO_ADD_REVIEW_ERROR_MESSAGE
} from './constants';

import {
  AddToCartFormSchema as MockAddToCartFormSchema,
  OrderProductsFormSchema as MockOrderProductsFormSchema,
  ReviewFormSchema as MockReviewFormSchema
} from './form_schemas';
import { transformProductsData as mockTransformProductsData } from './transformers';
import { stripe as mockStripe } from './stripe';
import { STRIPE_SESSION_CREATE_PARAMS } from '$lib/config';
import type { Cart } from '$lib/definitions';
import { createCart as mockCreateCart } from './model/data/cart.server';
import { addReview as mockAddReview } from '$lib/model/data/review.server';

vi.mock('./model/data/cart.server', () => ({
  createCart: vi.fn()
}));
vi.mock('./model/data/review.server', () => ({
  addReview: vi.fn()
}));
vi.mock('./stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn()
       }
     }
   }
}));
vi.mock('./form_schemas', () => ({
  AddToCartFormSchema: {
    safeParse: vi.fn()
   },
  OrderProductsFormSchema: {
    safeParse: vi.fn()
   },
  ReviewFormSchema: {
    safeParse: vi.fn()
   }
}));
vi.mock('./transformers');

describe('actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addToCart', () => {
    const expectedProductId = '1';
    const expectedFormData = new FormData();

    beforeAll(() => {
      expectedFormData.append('product_id', expectedProductId);
    });

    describe('form actions', () => {
      test('form data validation failed', async () => {
        // Arrange
        const expectedPrevState = undefined;
        const expectedFormDataLocal = new FormData();
        const expectedProductId = '-1';
        expectedFormDataLocal.append('product_id', expectedProductId);
        const expectedData = { product_id: expectedProductId };
        const expectedFieldErrors = { product_id: ['Wrong product id'] };
        const expectedNewState: AddToCartFormState = {
          errors: expectedFieldErrors,
          message: ADD_TO_CART_MISSING_FIELDS_ERROR_MESSAGE
        };
        (MockAddToCartFormSchema.safeParse as Mock).mockReturnValue({
          success: false,
          error: { flatten: () => ({ fieldErrors: expectedFieldErrors }) }
        });

        // Act
        const actualNewState = await addToCart(expectedPrevState, expectedFormDataLocal);

        // Assert
        expect(actualNewState).toEqual(expectedNewState);
        expect(MockAddToCartFormSchema.safeParse).toHaveBeenCalledWith(expectedData);
      });

      test('error creating cart', async () => {
        // Arrange
        const expectedPrevState = undefined;
        const expectedDbErrorMessage = 'Failed to create cart';
        const expectedParsedData = { product_id: '1' };
        const expectedNewState: AddToCartFormState = {
          message: expectedDbErrorMessage
        };
        (MockAddToCartFormSchema.safeParse as Mock).mockReturnValue({
          success: true,
          data: expectedParsedData
        });
        (mockCreateCart as Mock).mockImplementation(() => {
          throw new Error(expectedDbErrorMessage);
        });

        // Act
        const actualNewState = await addToCart(expectedPrevState, expectedFormData);

        // Assert
        expect(actualNewState).toEqual(expectedNewState);
        expect(MockAddToCartFormSchema.safeParse).toHaveBeenCalledWith({ product_id: '1' });
        expect(mockCreateCart).toHaveBeenCalledWith({...expectedParsedData, user_id: '1'});
      });

      test('create cart', async () => {
        // Arrange
        const expectedPrevState = undefined;
        const expectedNewState = undefined;
        const expectedParsedData = { product_id: '1' };
        (MockAddToCartFormSchema.safeParse as Mock).mockReturnValue({
          success: true,
          data: expectedParsedData
        });
        const expectedCart: Cart = {
          products: [],
          summary: { deliveryFee: 0, discount: 0, subtotal: 0, total: 0 },
          user_id: ''
        };
        (mockCreateCart as Mock).mockResolvedValue(expectedCart);

        // Act
        const actualNewState = await addToCart(expectedPrevState, expectedFormData);

        // Assert
        expect(actualNewState).toEqual(expectedNewState);
        expect(MockAddToCartFormSchema.safeParse).toHaveBeenCalledWith({ product_id: '1' });
        expect(mockCreateCart).toHaveBeenCalledWith({...expectedParsedData, user_id: '1'});
      });
    });
  });

  describe('orderProducts', () => {
    beforeAll(() => {
      process.env.ORIGIN = 'http://localhost:5173';
    });

    afterEach(() => {
      delete process.env.ORIGIN;
    });

    const expectedFormData = new FormData();
    const expected_product_0_color_id = '1';
    const expected_product_0_product_id = '1';
    const expected_product_0_quantity = '1';
    const expected_product_0_size_id = '1';
    const expected_product_0_color_id_key = 'products[0][color_id]';
    const expected_product_0_product_id_key = 'products[0][product_id]';
    const expected_product_0_quantity_key = 'products[0][quantity]';
    const expected_product_0_size_id_key = 'products[0][size_id]';
    const expected_product_1_color_id = '2';
    const expected_product_1_product_id = '2';
    const expected_product_1_quantity = '2';
    const expected_product_1_size_id = '2';
    const expected_product_1_color_id_key = 'products[1][color_id]';
    const expected_product_1_product_id_key = 'products[1][product_id]';
    const expected_product_1_quantity_key = 'products[1][quantity]';
    const expected_product_1_size_id_key = 'products[1][size_id]';
    const expectedTotal = '100';
    const expectedData = {
      [expected_product_0_color_id_key]: expected_product_0_color_id,
      [expected_product_0_product_id_key]: expected_product_0_product_id,
      [expected_product_0_quantity_key]: expected_product_0_quantity,
      [expected_product_0_size_id_key]: expected_product_0_size_id,
      [expected_product_1_color_id_key]: expected_product_1_color_id,
      [expected_product_1_product_id_key]: expected_product_1_product_id,
      [expected_product_1_quantity_key]: expected_product_1_quantity,
      [expected_product_1_size_id_key]: expected_product_1_size_id,
      total: expectedTotal
    };

    beforeAll(() => {
      expectedFormData.append(expected_product_0_color_id_key, expected_product_0_color_id);
      expectedFormData.append(expected_product_0_product_id_key, expected_product_0_product_id);
      expectedFormData.append(expected_product_0_quantity_key, expected_product_0_quantity);
      expectedFormData.append(expected_product_0_size_id_key, expected_product_0_size_id);
      expectedFormData.append(expected_product_1_color_id_key, expected_product_1_color_id);
      expectedFormData.append(expected_product_1_product_id_key, expected_product_1_product_id);
      expectedFormData.append(expected_product_1_quantity_key, expected_product_1_quantity);
      expectedFormData.append(expected_product_1_size_id_key, expected_product_1_size_id);
      expectedFormData.append('total', expectedTotal);
    });

    test('form data validation failed', async () => {
      // Arrange
      const expectedPrevState = undefined;
      const expectedTransformedData = {
        products: [
          {
            color_id: expected_product_0_color_id,
            product_id: expected_product_0_product_id,
            quantity: expected_product_0_quantity,
            size_id: expected_product_0_size_id
          },
          {
            color_id: expected_product_1_color_id,
            product_id: expected_product_1_product_id,
            quantity: expected_product_1_quantity,
            size_id: expected_product_1_size_id
          }
        ],
        total: expectedTotal
      };
      const expectedFieldErrors = { total: ['Expected numeric total'] };
      const expectedNewState: OrderProductsFormState = {
        errors: expectedFieldErrors,
        message: ORDER_PRODUCTS_MISSING_FIELDS_ERROR_MESSAGE
      };
      (MockOrderProductsFormSchema.safeParse as Mock).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: expectedFieldErrors }) }
      });
      (mockTransformProductsData as Mock).mockReturnValue(expectedTransformedData);

      // Act
      const actualNewState = await orderProducts(expectedPrevState, expectedFormData);

      // Assert
      expect(actualNewState).toEqual(expectedNewState);
      expect(mockTransformProductsData).toHaveBeenCalledWith(expectedData);
      expect(MockOrderProductsFormSchema.safeParse).toHaveBeenCalledWith(expectedTransformedData);
    });

    test('redirect to stripe', async () => {
      // Arrange
      const expectedPrevState = undefined;
      const expectedCheckoutSessionUrl = 'https://stripe.com/checkout/session/123456789';
      const expectedNumericTotal = 100;
      const expectedTransformedData = {
        products: [
          {
            color_id: expected_product_0_color_id,
            product_id: expected_product_0_product_id,
            quantity: expected_product_0_quantity,
            size_id: expected_product_0_size_id
          },
          {
            color_id: expected_product_1_color_id,
            product_id: expected_product_1_product_id,
            quantity: expected_product_1_quantity,
            size_id: expected_product_1_size_id
          }
        ],
        total: expectedNumericTotal
      };
      const expectedStripeSessionConfiguration = {
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Total for clothes: '
              },
              unit_amount: expectedNumericTotal * 100
            }
          }
        ],
        success_url: `http://localhost:5173/cart/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/cart`,
        ...STRIPE_SESSION_CREATE_PARAMS
      };
      (MockOrderProductsFormSchema.safeParse as Mock).mockReturnValue({
        success: true,
        data: expectedTransformedData
      });
      (mockTransformProductsData as Mock).mockReturnValue(expectedTransformedData);
      (mockStripe.checkout.sessions.create as Mock).mockReturnValue({
        url: expectedCheckoutSessionUrl
      });

      // Act
      const actualNewState = await orderProducts(expectedPrevState, expectedFormData);

      // Assert
      expect(actualNewState).toEqual({ url: expectedCheckoutSessionUrl });
      expect(mockTransformProductsData).toHaveBeenCalledWith(expectedData);
      expect(MockOrderProductsFormSchema.safeParse).toHaveBeenCalledWith(expectedTransformedData);
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expectedStripeSessionConfiguration
      );
    });
  });

  describe('submitReview', () => {
    test('validation failed', async () => {
      // Arrange
      const expectedData = {};
      const expectedFormData = new FormData();
      const expectedFieldErrors = {
        review_title: ['Missing review title'],
        review_text: ['Missing review text'],
        rating: ['Missing rating']
      };
      const expectedNewState: SubmitReviewFormState = {
        errors: expectedFieldErrors,
        message: ADD_REVIEW_MISSING_FIELDS_ERROR_MESSAGE
      };
      (MockReviewFormSchema.safeParse as Mock).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: expectedFieldErrors }) }
      });

      // Act
      const actualNewState = await submitReview(undefined, expectedFormData);

      // Assert
      expect(actualNewState).toEqual(expectedNewState);
      expect(MockReviewFormSchema.safeParse).toHaveBeenCalledWith(expectedData);
    });

    describe('form validated successfully', () => {
      const expectedReviewTitle = 'title';
      const expectedReviewText = 'text';
      const expectedReviewRating = '5';
      const expectedProductId = '1';
      const expectedData = {
        product_id: expectedProductId,
        review_title: expectedReviewTitle,
        review_text: expectedReviewText,
        rating: expectedReviewRating
      };
      const expectedFormData = new FormData();
      const expectedReview = {
        product_id: expectedProductId,
        rating: expectedReviewRating,
        review_text: expectedReviewText,
        title: expectedReviewTitle
      };

      beforeAll(() => {
        expectedFormData.append('product_id', expectedProductId);
        expectedFormData.append('review_title', expectedReviewTitle);
        expectedFormData.append('review_text', expectedReviewText);
        expectedFormData.append('rating', expectedReviewRating);
      });

      test('database error', async () => {
        // Arrange
        const expectedNewState: SubmitReviewFormState = {
          message: FAILED_TO_ADD_REVIEW_ERROR_MESSAGE
        };
        (MockReviewFormSchema.safeParse as Mock).mockReturnValue({
          success: true,
          data: expectedData
        });
        (mockAddReview as Mock).mockImplementation(() => {
          throw new Error('Failed to add review');
        });

        // Act
        const actualNewState = await submitReview(undefined, expectedFormData);

        // Assert
        expect(actualNewState).toEqual(expectedNewState);
        expect(MockReviewFormSchema.safeParse).toHaveBeenCalledWith(expectedData);
        expect(mockAddReview).toHaveBeenCalledWith(expectedReview);
      });

      test('review added', async () => {
        // Arrange
        const expectedNewState = undefined;
        const expectedReview = {
          product_id: expectedProductId,
          rating: expectedReviewRating,
          review_text: expectedReviewText,
          title: expectedReviewTitle
        };
        (MockReviewFormSchema.safeParse as Mock).mockReturnValue({
          success: true,
          data: expectedData
        });
        (mockAddReview as Mock).mockResolvedValue(expectedReview);

        // Act
        const actualNewState = await submitReview(undefined, expectedFormData);

        // Assert
        expect(actualNewState).toEqual(expectedNewState);
        expect(MockReviewFormSchema.safeParse).toHaveBeenCalledWith(expectedData);
        expect(mockAddReview).toHaveBeenCalledWith(expectedReview);
      });
    });
  });
});
