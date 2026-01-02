import type { PageServerLoad } from './$types';
import { fetchProduct } from '$lib/model/data/product.server';
import { AddToCartFormSchema, ReviewFormSchema } from '$lib/form_schemas';
import {
  ADD_REVIEW_MISSING_FIELDS_ERROR_MESSAGE,
  ADD_TO_CART_MISSING_FIELDS_ERROR_MESSAGE,
  FAILED_TO_ADD_REVIEW_ERROR_MESSAGE
} from '$lib/constants';
import { addReview } from '$lib/model/data/review.server';
import { type Actions, fail } from '@sveltejs/kit';
import { createCart } from '$lib/model/data/cart.server';

export const load: PageServerLoad = async ({ params }) => {
  const product_id = parseInt(params.id, 10);
  const product = await fetchProduct(product_id);
  return { product };
};

export const actions = {
  submitReview: async ({ request }) => {
    const formData = await request.formData();

    const validated = ReviewFormSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) {
      return fail(400, {
        errors: validated.error.flatten().fieldErrors,
        message: ADD_REVIEW_MISSING_FIELDS_ERROR_MESSAGE
      });
    }

    try {
      await addReview({
        product_id: validated.data.product_id,
        title: validated.data.review_title,
        review_text: validated.data.review_text,
        rating: validated.data.rating
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return fail(500, {
          message: FAILED_TO_ADD_REVIEW_ERROR_MESSAGE
        });
      }
    }
  },

  addToCart: async ({ request }) => {
    const formData = await request.formData();
    const user = { id: '1', username: 'test' };

    // const user_session = await auth();
    // if (!user_session) {
    //   return {
    //     message: USER_NOT_LOGGED_IN_MESSAGE
    //   };
    // }
    // const { user } = user_session;
    // if (!user || !user.id) {
    //   return {
    //     message: USER_NOT_LOGGED_IN_MESSAGE
    //   };
    // }
    const validated = AddToCartFormSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) {
      return fail(400, {
        errors: validated.error.flatten().fieldErrors,
        message: ADD_TO_CART_MISSING_FIELDS_ERROR_MESSAGE
      });
    }

    try {
      await createCart({ user_id: user.id, ...validated.data });

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, {
          message: error.message
        });
      }
    }
  }
} satisfies Actions;
