import type { PageServerLoad } from './$types';
import { fetchProduct } from '$lib/model/data/product.server';
import { ReviewFormSchema } from '$lib/form_schemas';
import {
  ADD_REVIEW_MISSING_FIELDS_ERROR_MESSAGE,
  FAILED_TO_ADD_REVIEW_ERROR_MESSAGE
} from '$lib/constants';
import { addReview } from '$lib/model/data/review.server';
import  { type Actions, fail } from '@sveltejs/kit';

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
  }
} satisfies Actions;
