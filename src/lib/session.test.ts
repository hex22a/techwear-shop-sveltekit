import { describe, test, expect, beforeAll, afterAll, vi, type Mock, beforeEach } from 'vitest';

import {
  deleteCurrentWebauthnSession,
  getCurrentWebauthnSession,
  getWebauthnSession,
  setWebauthnSession,
  updateCurrentWebauthnSession,
  type WebauthnSessionData
} from './session';

import mockRedis from './redis';
import {
  WEBAUTHN_SESSION_ID_COOKIE_NAME,
  WEBAUTHN_SESSION_PREFIX,
  WEBAUTHN_SESSION_TTL
} from './constants';
import type { Cookies as MockCookies } from '@sveltejs/kit';

vi.mock('./redis', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn()
  }
}));
vi.mock('@sveltejs/kit');

const mockCookies: MockCookies = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  getAll: vi.fn(),
  serialize: vi.fn()
};

describe('session', () => {
  const expectedUsername = 'test';
  const expectedChallenge = 'challenge';
  const expectedSessionId = 'lllllllllle';
  const expectedRedisKey = WEBAUTHN_SESSION_PREFIX + expectedSessionId;
  const expectedExpirationArgument = 'EX';

  const expectedCookieOptions: { path: string } = { path: '/' };

  const expectedRandomNumber = 0.6;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    vi.spyOn(Math, 'random').mockReturnValue(expectedRandomNumber);
  });

  afterAll(() => {
    (Math.random as Mock).mockRestore();
  });

  describe('getWebauthnSession', () => {
    const expectedSession = null;
    const expectedSessionString = null;

    test('no session', async () => {
      // Arrange
      (mockRedis.get as Mock).mockResolvedValue(expectedSessionString);

      // Act
      const actualSession = await getWebauthnSession(expectedSessionId);

      // Assert
      expect(actualSession).toEqual(expectedSession);
      expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
    });

    test('session exists on redis', async () => {
      // Arrange
      const expectedSession: WebauthnSessionData = {
        username: expectedUsername,
        currentChallenge: expectedChallenge
      };
      const expectedSessionString = JSON.stringify(expectedSession);
      (mockRedis.get as Mock).mockResolvedValue(expectedSessionString);

      // Act
      const actualSession = await getWebauthnSession(expectedSessionId);

      // Assert
      expect(actualSession).toEqual(expectedSession);
      expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
    });
  });

  test('setWebauthnSession', async () => {
    // Arrange
    const expectedSessionData: WebauthnSessionData = {
      username: expectedUsername,
      currentChallenge: expectedChallenge
    };
    const expectedSessionString = JSON.stringify(expectedSessionData);

    // Act
    await setWebauthnSession(expectedSessionId, expectedSessionData);

    // Assert
    expect(mockRedis.set).toHaveBeenCalledWith(
      expectedRedisKey,
      expectedSessionString,
      expectedExpirationArgument,
      WEBAUTHN_SESSION_TTL
    );
  });

  describe('complex checks involving cookies', () => {
    const expectedCookieValue = expectedSessionId;

    describe('getCurrentWebauthnSession', () => {
      test('no cookie present', async () => {
        // Arrange
        const expectedSessionData: WebauthnSessionData = {};
        const expectedSession = { sessionId: expectedSessionId, data: expectedSessionData };
        const expectedSessionString = JSON.stringify(expectedSessionData);
        (mockCookies.get as Mock).mockReturnValue(undefined);

        // Act
        const actualSession = await getCurrentWebauthnSession(mockCookies);

        // Assert
        expect(actualSession).toEqual(expectedSession);
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockCookies.set).toHaveBeenCalledWith(
          WEBAUTHN_SESSION_ID_COOKIE_NAME,
          expectedSessionId,
          expectedCookieOptions
        );
        expect(mockRedis.set).toHaveBeenCalledWith(
          expectedRedisKey,
          expectedSessionString,
          expectedExpirationArgument,
          WEBAUTHN_SESSION_TTL
        );
      });

      test('cookie exists but session is missing/expired on redis', async () => {
        // Arrange
        const expectedSessionData: WebauthnSessionData = {};
        const expectedSession = { sessionId: expectedSessionId, data: expectedSessionData };
        const expectedSessionString = JSON.stringify(expectedSessionData);

        (mockCookies.get as Mock).mockReturnValue(expectedCookieValue);
        (mockRedis.get as Mock).mockResolvedValue(null);

        // Act
        const actualSession = await getCurrentWebauthnSession(mockCookies);

        // Assert
        expect(actualSession).toEqual(expectedSession);
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
        expect(mockCookies.set).toHaveBeenCalledWith(
          WEBAUTHN_SESSION_ID_COOKIE_NAME,
          expectedSessionId,
          expectedCookieOptions
        );
        expect(mockRedis.set).toHaveBeenCalledWith(
          expectedRedisKey,
          expectedSessionString,
          expectedExpirationArgument,
          WEBAUTHN_SESSION_TTL
        );
      });

      test('cookie exists and session is present on redis', async () => {
        // Arrange
        const expectedSessionData: WebauthnSessionData = {
          username: expectedUsername,
          currentChallenge: expectedChallenge
        };
        const expectedSession = { sessionId: expectedSessionId, data: expectedSessionData };
        const expectedSessionString = JSON.stringify(expectedSessionData);

        (mockCookies.get as Mock).mockReturnValue(expectedCookieValue);
        (mockRedis.get as Mock).mockResolvedValue(expectedSessionString);

        // Act
        const actualSession = await getCurrentWebauthnSession(mockCookies);

        // Assert
        expect(actualSession).toEqual(expectedSession);
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
      });
    });

    describe('deleteSession', () => {
      test('no cookie present', async () => {
        // Arrange
        (mockCookies.get as Mock).mockReturnValue(undefined);

        // Act
        await deleteCurrentWebauthnSession(mockCookies);

        // Assert
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockCookies.set).not.toHaveBeenCalled();
        expect(mockRedis.set).not.toHaveBeenCalled();
        expect(mockRedis.del).not.toHaveBeenCalled();
      });

      test('cookie exists but session is missing/expired on redis', async () => {
        // Arrange
        (mockCookies.get as Mock).mockReturnValue(expectedCookieValue);
        (mockRedis.get as Mock).mockResolvedValue(null);

        // Act
        await deleteCurrentWebauthnSession(mockCookies);

        // Assert
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
        expect(mockCookies.set).not.toHaveBeenCalled();
        expect(mockRedis.set).not.toHaveBeenCalled();
        expect(mockRedis.del).not.toHaveBeenCalled();
      });

      test('cookie exists and session is present on redis', async () => {
        // Arrange
        const expectedSessionData: WebauthnSessionData = {
          username: expectedUsername,
          currentChallenge: expectedChallenge
        };
        const expectedSessionString = JSON.stringify(expectedSessionData);

        (mockCookies.get as Mock).mockReturnValue(expectedCookieValue);
        (mockRedis.get as Mock).mockResolvedValue(expectedSessionString);

        // Act
        await deleteCurrentWebauthnSession(mockCookies);

        // Assert
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
        expect(mockRedis.del).toHaveBeenCalledWith(expectedRedisKey);
      });
    });

    describe('updateCurrentWebauthnSession', () => {
      test('no cookie present', async () => {
        // Arrange
        const expectedNewChallenge = 'newChallenge';
        const expectedNewSessionData: WebauthnSessionData = {
          currentChallenge: expectedNewChallenge
        };

        (mockCookies.get as Mock).mockReturnValue(undefined);

        // Act
        await updateCurrentWebauthnSession(mockCookies, expectedNewSessionData);

        // Assert
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockCookies.set).not.toHaveBeenCalled();
        expect(mockRedis.set).not.toHaveBeenCalled();
        expect(mockRedis.set).not.toHaveBeenCalled();
      });

      test('cookie exists but session is missing/expired on redis', async () => {
        // Arrange
        const expectedNewChallenge = 'newChallenge';
        const expectedSessionData: WebauthnSessionData = {};
        const expectedNewSessionData: WebauthnSessionData = {
          currentChallenge: expectedNewChallenge
        };
        const expectedSessionString = JSON.stringify(expectedSessionData);
        const expectedNewSessionString = JSON.stringify(expectedNewSessionData);

        (mockCookies.get as Mock).mockReturnValue(expectedCookieValue);
        (mockRedis.get as Mock).mockResolvedValue(null);

        // Act
        await updateCurrentWebauthnSession(mockCookies, expectedNewSessionData);

        // Assert
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
        expect(mockCookies.set).toHaveBeenCalledWith(
          WEBAUTHN_SESSION_ID_COOKIE_NAME,
          expectedSessionId,
          expectedCookieOptions
        );
        expect(mockRedis.set).not.toHaveBeenCalledWith(
          expectedRedisKey,
          expectedSessionString,
          expectedExpirationArgument,
          WEBAUTHN_SESSION_TTL
        );
        expect(mockRedis.set).toHaveBeenCalledWith(
          expectedRedisKey,
          expectedNewSessionString,
          expectedExpirationArgument,
          WEBAUTHN_SESSION_TTL
        );
      });

      test('cookie exists and session is present on redis', async () => {
        // Arrange
        const expectedSessionData: WebauthnSessionData = {
          username: expectedUsername,
          currentChallenge: expectedChallenge
        };
        const expectedNewSessionData: WebauthnSessionData = {
          username: expectedUsername,
          currentChallenge: '1'
        };
        const expectedSessionString = JSON.stringify(expectedSessionData);
        const expectedNewSessionString = JSON.stringify(expectedNewSessionData);

        (mockCookies.get as Mock).mockReturnValue(expectedCookieValue);
        (mockRedis.get as Mock).mockResolvedValue(expectedSessionString);

        // Act
        await updateCurrentWebauthnSession(mockCookies, expectedNewSessionData);

        // Assert
        expect(mockCookies.get).toHaveBeenCalledWith(WEBAUTHN_SESSION_ID_COOKIE_NAME);
        expect(mockRedis.get).toHaveBeenCalledWith(expectedRedisKey);
        expect(mockRedis.set).toHaveBeenCalledWith(
          expectedRedisKey,
          expectedNewSessionString,
          expectedExpirationArgument,
          WEBAUTHN_SESSION_TTL
        );
      });
    });
  });
});
