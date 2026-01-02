import type { RequestHandler } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';

import { generateWebAuthnRegistrationOptions } from '$lib/webauthn.server';

export const POST: RequestHandler = async ({
  cookies,
  request
}: {
  cookies: Cookies;
  request: Request;
}) => {
  const { username } = await request.json();

  const result = await generateWebAuthnRegistrationOptions(cookies, username);

  return new Response(JSON.stringify(result));
};
