import redis from './redis';
import type { Base64URLString } from '@simplewebauthn/server';
import {
  WEBAUTHN_SESSION_ID_COOKIE_NAME,
  WEBAUTHN_SESSION_PREFIX,
  WEBAUTHN_SESSION_TTL
} from './constants';
import type { Cookies } from '@sveltejs/kit';

export type WebauthnSessionData = {
  currentChallenge?: Base64URLString;
  username?: string;
};

export type AuthSessionData = {
  userId: string;
  expires: string;
};

const AUTH_SESSION_PREFIX = 'auth:session:';
const AUTH_SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const VERIFICATION_TOKEN_PREFIX = 'auth:verification:';

async function getSessionData<T>(prefix: string, sessionId: string): Promise<T | null> {
  const sessionData = await redis.get(prefix + sessionId);
  return sessionData ? JSON.parse(sessionData) : null;
}

export async function getWebauthnSession(sessionId: string): Promise<WebauthnSessionData | null> {
  return getSessionData<WebauthnSessionData>(WEBAUTHN_SESSION_PREFIX, sessionId);
}

async function setSession<T>(
  prefix: string,
  sessionId: string,
  sessionData: T,
  ttl: number
): Promise<void> {
  await redis.set(prefix + sessionId, JSON.stringify(sessionData), 'EX', ttl);
}

export async function setWebauthnSession(
  sessionId: string,
  sessionData: WebauthnSessionData
): Promise<void> {
  await setSession(WEBAUTHN_SESSION_PREFIX, sessionId, sessionData, WEBAUTHN_SESSION_TTL);
}

async function fetchCurrentSession<T>(
  cookies: Cookies,
  cookieName: string,
  fetchSession: (sessionId: string) => Promise<T | null>
): Promise<{ sessionId: string; data: T } | null> {
  const sessionCookie = cookies.get(cookieName);

  if (sessionCookie) {
    const session = await fetchSession(sessionCookie);
    if (session) {
      return { sessionId: sessionCookie, data: session };
    }
  }
  return null;
}

async function createNewSession<T>(
  cookies: Cookies,
  cookieName: string,
  updateSession: (sessionId: string, sessionData: T) => Promise<void>,
  newSessionData: T
): Promise<{ sessionId: string; data: T }> {
  const newSessionId = Math.random().toString(36).slice(2);
  cookies.set(cookieName, newSessionId, { path: '/' });
  await updateSession(newSessionId, newSessionData);
  return { sessionId: newSessionId, data: newSessionData };
}

export async function getCurrentWebauthnSession(
  cookies: Cookies
): Promise<{ sessionId: string; data: WebauthnSessionData }> {
  const session = await fetchCurrentSession<WebauthnSessionData>(
    cookies,
    WEBAUTHN_SESSION_ID_COOKIE_NAME,
    getWebauthnSession
  );
  if (session) {
    return session;
  }
  return createNewSession<WebauthnSessionData>(
    cookies,
    WEBAUTHN_SESSION_ID_COOKIE_NAME,
    setWebauthnSession,
    {
      currentChallenge: undefined,
      username: undefined
    }
  );
}

async function deleteSession(
  getSession: () => Promise<{ sessionId: string } | null>
): Promise<void> {
  const session = await getSession();
  if (session) {
    const { sessionId } = session;
    await redis.del(WEBAUTHN_SESSION_PREFIX + sessionId);
  }
}

export async function deleteCurrentWebauthnSession(cookies: Cookies): Promise<void> {
  const getCurSession = (fetchCurrentSession<WebauthnSessionData>).bind(
    null,
    cookies,
    WEBAUTHN_SESSION_ID_COOKIE_NAME,
    getWebauthnSession
  );
  await deleteSession(getCurSession);
}

async function updateSession<T>(
  cookies: Cookies,
  cookieName: string,
  getSession: () => Promise<{ sessionId: string; data: T } | null>,
  setSession: (sessionId: string, sessionData: T) => Promise<void>,
  createSession: (sessionData: T) => Promise<{ sessionId: string; data: T }>,
  newData: T
): Promise<void> {
  const sessionCookie = cookies.get(cookieName);
  if (sessionCookie) {
    const session = await getSession();
    if (session) {
      const { sessionId, data: oldData } = session;
      await setSession(sessionId, { ...oldData, ...newData });
    } else {
      await createSession(newData);
    }
  }
}

export async function updateCurrentWebauthnSession(
  cookies: Cookies,
  data: WebauthnSessionData
): Promise<void> {
  await updateSession(
    cookies,
    WEBAUTHN_SESSION_ID_COOKIE_NAME,
    (fetchCurrentSession<WebauthnSessionData>).bind(
      null,
      cookies,
      WEBAUTHN_SESSION_ID_COOKIE_NAME,
      getWebauthnSession
    ),
    setWebauthnSession,
    (createNewSession<WebauthnSessionData>).bind(
      null,
      cookies,
      WEBAUTHN_SESSION_ID_COOKIE_NAME,
      setWebauthnSession
    ),
    data
  );
}

// ============ NEW AUTH SESSION METHODS ============

export async function createAuthSession(sessionToken: string, userId: string, expires: Date): Promise<void> {
  await setSession(AUTH_SESSION_PREFIX, sessionToken, { userId, expires: expires.toISOString() }, AUTH_SESSION_TTL);
}

export async function getAuthSession(sessionToken: string): Promise<AuthSessionData | null> {
  return getSessionData<AuthSessionData>(AUTH_SESSION_PREFIX, sessionToken);
}

export async function updateAuthSession(sessionToken: string, expires: Date): Promise<void> {
  const session = await getAuthSession(sessionToken);
  if (!session) return;

  session.expires = expires.toISOString();
  await setSession(AUTH_SESSION_PREFIX, sessionToken, session, AUTH_SESSION_TTL);
}

export async function deleteAuthSession(sessionToken: string): Promise<void> {
  await redis.del(AUTH_SESSION_PREFIX + sessionToken);
}

// ============ VERIFICATION TOKEN METHODS ============

export async function createVerificationToken(identifier: string, token: string, expires: Date): Promise<void> {
  const ttl = Math.floor((expires.getTime() - Date.now()) / 1000);
  await setSession(
    VERIFICATION_TOKEN_PREFIX,
    `${identifier}:${token}`,
    { identifier, expires: expires.toISOString(), token },
    ttl > 0 ? ttl : 60
  );
}

export async function useVerificationToken(identifier: string, token: string): Promise<{ identifier: string; expires: Date; token: string } | null> {
  const key = `${identifier}:${token}`;
  const data = await getSessionData<{ identifier: string; expires: string; token: string }>(
    VERIFICATION_TOKEN_PREFIX,
    key
  );

  if (!data) return null;

  await redis.del(VERIFICATION_TOKEN_PREFIX + key);

  return {
    identifier: data.identifier,
    expires: new Date(data.expires),
    token: data.token
  };
}
