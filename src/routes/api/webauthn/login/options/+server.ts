import { json } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateWebAuthnLoginOptions, type WebAuthnResponse } from '$lib/webauthn.server';

export const POST: RequestHandler = async ({
  cookies,
  request
}: {
  cookies: Cookies;
  request: Request;
}) => {
  const { username } = await request.json();

  const result: WebAuthnResponse = await generateWebAuthnLoginOptions(cookies, username);

  return json(result);
};
