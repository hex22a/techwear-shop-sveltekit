import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { verifyWebAuthnRegistration } from '$lib/webauthn.server';
import type { RegistrationResponseJSON } from '@simplewebauthn/server';

export const POST: RequestHandler = async ({
  cookies,
  request
}: {
  cookies: Cookies;
  request: Request;
}) => {
  const data = await request.json();
  const { localResponse }: { localResponse: RegistrationResponseJSON } = data;

  const result = await verifyWebAuthnRegistration(cookies, localResponse);

  return new Response(JSON.stringify(result));
};
