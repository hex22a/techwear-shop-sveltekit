import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
  const session = event.locals.session;
  // console.log(session);

  return {
    session
  };
};
