'use server';

import { stripe } from './stripe';
import {
  ADD_TO_CART_MISSING_FIELDS_ERROR_MESSAGE,
  ORDER_PRODUCTS_MISSING_FIELDS_ERROR_MESSAGE,
  ADD_REVIEW_MISSING_FIELDS_ERROR_MESSAGE,
  FAILED_TO_ADD_REVIEW_ERROR_MESSAGE
} from '$lib/constants';
import { STRIPE_SESSION_CREATE_PARAMS } from './config';
import { AddToCartFormSchema, OrderProductsFormSchema, ReviewFormSchema } from './form_schemas';
import { transformProductsData } from './transformers';
import { createCart } from '$lib/model/data/cart.server';
import { addReview } from '$lib/model/data/review.server';

export type AddToCartFormState = {
  errors?: {
    product_id?: string[];
    color_id?: string[];
    size_id?: string[];
    quantity?: string[];
  };
  message?: string | null;
};

// NOTE: Auth guard removed — server actions cannot access cookies/sessions directly.
// Auth can be added later via SvelteKit hooks or middleware pattern.
export async function addToCart(prevState: AddToCartFormState | undefined, formData: FormData) {
  const validated = AddToCartFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: ADD_TO_CART_MISSING_FIELDS_ERROR_MESSAGE
    };
  }

  try {
    await createCart({ ...validated.data, user_id: '1' });
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message
      };
    }
  }
}

export type OrderProductsFormState = {
  errors?: {
    products?: string[];
    total?: string[];
  };
  message?: string | null;
  url?: string | null;
};

export async function orderProducts(
  prevState: OrderProductsFormState | undefined,
  formData: FormData
) {
  const ORIGIN = process.env.ORIGIN || `http://localhost:5173`;

  const data = transformProductsData(Object.fromEntries(formData.entries()));
  const validated = OrderProductsFormSchema.safeParse(data);
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: ORDER_PRODUCTS_MISSING_FIELDS_ERROR_MESSAGE
    };
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Total for clothes: '
          },
          unit_amount: validated.data.total * 100
        }
      }
    ],
    success_url: `${ORIGIN}/cart/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ORIGIN}/cart`,
    ...STRIPE_SESSION_CREATE_PARAMS
  });
  return {
    url: checkoutSession.url
  };
}

export type SubmitReviewFormState = {
  errors?: {
    product_id?: string[];
    review_title?: string[];
    review_text?: string[];
    rating?: string[];
  };
  message?: string | null;
};

export async function submitReview(
  prevState: SubmitReviewFormState | undefined,
  formData: FormData
) {
  const validated = ReviewFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: ADD_REVIEW_MISSING_FIELDS_ERROR_MESSAGE
    };
  }

  try {
    await addReview({
      product_id: validated.data.product_id,
      title: validated.data.review_title,
      review_text: validated.data.review_text,
      rating: validated.data.rating
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: FAILED_TO_ADD_REVIEW_ERROR_MESSAGE
      };
    }
  }
}
