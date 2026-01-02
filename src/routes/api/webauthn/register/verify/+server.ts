import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { verifyWebAuthnRegistration } from '$lib/webauthn.server';

export const POST: RequestHandler = async ({
  cookies,
  request
}: {
  cookies: Cookies;
  request: Request;
}) => {
  const data = await request.json();

  const result = await verifyWebAuthnRegistration(cookies, data);

  return new Response(JSON.stringify(result));
};
