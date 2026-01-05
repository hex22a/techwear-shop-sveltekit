import type { Handle } from '@sveltejs/kit';
import { getUserSession } from '$lib/session';
import { USER_SESSION_ID_COOKIE_NAME } from '$lib/constants';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(USER_SESSION_ID_COOKIE_NAME);
  if (sessionId) {
    event.locals.session = await getUserSession(sessionId);
  } else {
    event.locals.session = null;
  }

  return resolve(event);
};
