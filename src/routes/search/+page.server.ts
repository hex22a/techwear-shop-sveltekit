import type { PageServerLoad } from './$types';
import {
  fetchAllCategories,
  fetchAllColors,
  fetchAllSizes,
  fetchAllStyles
} from '$lib/model/data/common.server';

export const load: PageServerLoad = async () => {
  const [colors, sizes, dressStyles, categories] = await Promise.all([
    fetchAllColors(),
    fetchAllSizes(),
    fetchAllStyles(),
    fetchAllCategories()
  ]);

  return {
    colors,
    sizes,
    dressStyles,
    categories
  };
};
