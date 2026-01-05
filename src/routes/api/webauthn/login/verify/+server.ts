import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { verifyWebAuthnLogin } from '$lib/webauthn.server';
import type { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { updateCurrentUserSession } from '$lib/session';

import { randomBytes } from 'crypto';
import { USER_SESSION_ID_COOKIE_NAME } from '$lib/constants';

export const POST: RequestHandler = async ({
  cookies,
  request
}: {
  cookies: Cookies;
  request: Request;
}) => {
  const data = await request.json();
  const { localResponse }: { localResponse: AuthenticationResponseJSON } = data;

  const result = await verifyWebAuthnLogin(cookies, localResponse);
  if (result.success) {
    const sessionToken = randomBytes(32).toString('hex');
    cookies.set(USER_SESSION_ID_COOKIE_NAME, sessionToken, { path: '/' });
    await updateCurrentUserSession(cookies, { id: result.userId });
  }

  return new Response(JSON.stringify(result));
};
