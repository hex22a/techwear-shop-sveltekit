import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { verifyWebAuthnLogin } from '$lib/webauthn.server';

export const POST: RequestHandler = async ({
  cookies,
  request
}: {
  cookies: Cookies;
  request: Request;
}) => {
  const data = await request.json();

  const result = await verifyWebAuthnLogin(cookies, data);

  return new Response(JSON.stringify(result));
};
