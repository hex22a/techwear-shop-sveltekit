import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/product/[id]/$types';
import type { Actions } from '@sveltejs/kit';
import { transformProductsData } from '$lib/transformers';
import { OrderProductsFormSchema } from '$lib/form_schemas';
import { ORDER_PRODUCTS_MISSING_FIELDS_ERROR_MESSAGE } from '$lib/constants';
import { stripe } from '$lib/stripe';
import { STRIPE_SESSION_CREATE_PARAMS } from '$lib/config';
import { getCart } from '$lib/model/data/cart.server';
import type { Cart } from '$lib/definitions';

export const load: PageServerLoad = async () => {
  const user_id = 'user_id';
  const cart: Cart = await getCart(user_id);
  return { cart };
};

export const actions = {
  orderProducts: async ({ request, url }) => {
    const formData = await request.formData();
    const origin: string = url.origin;

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
      success_url: `${origin}/cart/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      ...STRIPE_SESSION_CREATE_PARAMS
    });
    return {
      url: checkoutSession.url
    };
  }
} satisfies Actions;
