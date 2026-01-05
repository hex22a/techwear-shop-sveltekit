import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
  const session = event.locals;
  console.log(session);

  return {
    session
  };
};
