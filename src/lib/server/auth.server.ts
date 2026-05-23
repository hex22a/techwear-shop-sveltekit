import type { Cookies } from '@sveltejs/kit';
import { getUserSession } from '$lib/session';
import { USER_SESSION_ID_COOKIE_NAME } from '$lib/constants';

export interface Session {
  user: { id: string };
}

/**
 * The SvelteKit equivalent of NextAuth's `auth()` function.
 * Returns the current authenticated session if one exists and is valid.
 */
export async function getSession(cookies: Cookies): Promise<Session | null> {
  const sessionId = cookies.get(USER_SESSION_ID_COOKIE_NAME);
  if (!sessionId) return null;
  const sessionData = await getUserSession(sessionId);
  if (!sessionData?.id) return null;
  const id = sessionData.id;
  return { user: { id } };
}

/**
 * Returns a boolean indicating whether the current request is authenticated.
 */
export async function isAuthenticated(cookies: Cookies): Promise<boolean> {
  return (await getSession(cookies)) !== null;
}

/**
 * NextAuth-compatible callback pattern for middleware and route guards.
 * Receives the current auth state and returns a boolean guard result.
 */
export type AuthCallback = (event: { auth: Session | null }) => boolean | Promise<boolean>;
