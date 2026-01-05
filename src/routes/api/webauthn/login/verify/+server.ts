import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { verifyWebAuthnLogin } from '$lib/webauthn.server';
import type { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { setUserSession } from '$lib/session';

import { randomBytes } from 'crypto';

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
    await setUserSession(sessionToken, { id: result.userId });
  }

  return new Response(JSON.stringify(result));
};
