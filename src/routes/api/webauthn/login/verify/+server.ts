import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { verifyWebAuthnLogin } from '$lib/webauthn.server';
import type { AuthenticationResponseJSON } from '@simplewebauthn/server';

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

  return new Response(JSON.stringify(result));
};
