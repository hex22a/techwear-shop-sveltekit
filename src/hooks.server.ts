import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth.server';

export const handle: Handle = async ({ event, resolve }) => {
  const session = await getSession(event.cookies);
  if (session?.user?.id) {
    event.locals.session = { id: session.user.id };
  } else {
    event.locals.session = null;
  }
  return resolve(event);
};
