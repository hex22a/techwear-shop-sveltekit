import type { RequestHandler } from './$types';
import { type Cookies, redirect } from '@sveltejs/kit';
import { deleteCurrentUserSession } from '$lib/session';
import { USER_SESSION_ID_COOKIE_NAME } from '$lib/constants';

export const POST: RequestHandler = async ({ cookies }: { cookies: Cookies; request: Request }) => {
  await deleteCurrentUserSession(cookies);
  cookies.delete(USER_SESSION_ID_COOKIE_NAME, { path: '/' });

  throw redirect(303, '/signin');
};
