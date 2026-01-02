import type { PageServerLoad } from './$types';
import { getTopReviews } from '$lib/model/data/review.server';
import { fetchNewArrivals, fetchTopSelling } from '$lib/model/data/product.server';

export const load: PageServerLoad = async () => {
  const [reviews, newArrivals, topSelling] = await Promise.all([
    getTopReviews(),
    fetchNewArrivals(),
    fetchTopSelling()
  ]);

  return {
    newArrivals,
    topSelling,
    reviews
  };
};
