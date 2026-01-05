import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals;
  console.log(session);

  return {
    session
  };
};
