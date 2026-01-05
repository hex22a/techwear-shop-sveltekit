import redis from './redis';
import type { Base64URLString } from '@simplewebauthn/server';
import {
  USER_SESSION_ID_COOKIE_NAME,
  USER_SESSION_PREFIX,
  USER_SESSION_TTL,
  WEBAUTHN_SESSION_ID_COOKIE_NAME,
  WEBAUTHN_SESSION_PREFIX,
  WEBAUTHN_SESSION_TTL
} from './constants';
import type { Cookies } from '@sveltejs/kit';

export type WebauthnSessionData = {
  currentChallenge?: Base64URLString;
  username?: string;
};

export type UserSessionData = {
  id?: string;
};

async function getSessionData<T>(prefix: string, sessionId: string): Promise<T> {
  const sessionData = await redis.get(prefix + sessionId);
  return sessionData ? JSON.parse(sessionData) : (null as T);
}

export async function getWebauthnSession(sessionId: string): Promise<WebauthnSessionData> {
  return getSessionData<WebauthnSessionData>(WEBAUTHN_SESSION_PREFIX, sessionId);
}

export async function getUserSession(sessionId: string): Promise<UserSessionData> {
  return getSessionData<UserSessionData>(USER_SESSION_PREFIX, sessionId);
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

export async function setUserSession(
  sessionId: string,
  sessionData: UserSessionData
): Promise<void> {
  await setSession(USER_SESSION_PREFIX, sessionId, sessionData, USER_SESSION_TTL);
}

async function fetchCurrentSession<T>(
  cookies: Cookies,
  cookieName: string,
  fetchSession: (sessionId: string) => Promise<T>
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

export async function getCurrentUserSession(
  cookies: Cookies
): Promise<{ sessionId: string; data: UserSessionData } | null> {
  const session = await fetchCurrentSession<UserSessionData>(
    cookies,
    USER_SESSION_ID_COOKIE_NAME,
    getUserSession
  );
  if (session) {
    return session;
  }
  return null;
}

async function deleteSession(
  getSession: () => Promise<{ sessionId: string } | null>,
  cookieName: string
): Promise<void> {
  const session = await getSession();
  if (session) {
    const { sessionId } = session;
    await redis.del(cookieName + sessionId);
  }
}

export async function deleteCurrentWebauthnSession(cookies: Cookies): Promise<void> {
  const getCurSession = (fetchCurrentSession<WebauthnSessionData>).bind(
    null,
    cookies,
    WEBAUTHN_SESSION_ID_COOKIE_NAME,
    getWebauthnSession
  );
  await deleteSession(getCurSession, WEBAUTHN_SESSION_ID_COOKIE_NAME);
}

export async function deleteCurrentUserSession(cookies: Cookies): Promise<void> {
  const getCurSession = (fetchCurrentSession<UserSessionData>).bind(
    null,
    cookies,
    USER_SESSION_ID_COOKIE_NAME,
    getUserSession
  );
  await deleteSession(getCurSession, USER_SESSION_ID_COOKIE_NAME);
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

export async function updateCurrentUserSession(
  cookies: Cookies,
  data: UserSessionData
): Promise<void> {
  await updateSession(
    cookies,
    USER_SESSION_ID_COOKIE_NAME,
    (fetchCurrentSession<UserSessionData>).bind(
      null,
      cookies,
      USER_SESSION_ID_COOKIE_NAME,
      getUserSession
    ),
    setUserSession,
    (createNewSession<UserSessionData>).bind(
      null,
      cookies,
      USER_SESSION_ID_COOKIE_NAME,
      setUserSession
    ),
    data
  );
}
