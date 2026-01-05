import type { Adapter, AdapterUser } from '@auth/core/adapters';
import {
  findUser,
  findUserById,
  createUserOnly,
  updateUserById,
  deleteUserById,
  findUserByAccount,
  linkAccountToUser,
  unlinkAccountFromUser,
  getAccountByProvider,
  getPasskeyById,
  createPasskey,
  listPasskeysByUserId,
  updatePasskeyCounter
} from '$lib/model/data/user.server';
import {
  createAuthSession,
  getAuthSession,
  updateAuthSession,
  deleteAuthSession,
  createVerificationToken,
  useVerificationToken
} from '$lib/session';

export function CustomWebAuthnAdapter(): Adapter {
  return {
    // ============ USER METHODS ============
    async createUser(user) {
      const newUser = await createUserOnly(user.email || user.name!);
      return {
        id: newUser.id,
        email: newUser.username,
        emailVerified: null,
        name: newUser.username
      } as AdapterUser;
    },

    async getUser(id: string) {
      const user = await findUserById(id);
      if (!user) return null;
      return {
        id: user.id,
        email: user.username,
        emailVerified: null,
        name: user.username
      } as AdapterUser;
    },

    async getUserByEmail(email) {
      const user = await findUser(email);
      if (!user) return null;
      return {
        id: user.id,
        email: user.username,
        emailVerified: null,
        name: user.username
      } as AdapterUser;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const user = await findUserByAccount(providerAccountId, provider);
      if (!user) return null;
      return {
        id: user.id,
        email: user.username,
        emailVerified: null,
        name: user.username
      } as AdapterUser;
    },

    async updateUser(user) {
      const updatedUser = await updateUserById(user.id!, user.email!);
      return {
        id: updatedUser.id,
        email: updatedUser.username,
        emailVerified: null,
        name: updatedUser.username
      } as AdapterUser;
    },

    async deleteUser(userId) {
      await deleteUserById(userId);
    },

    // ============ ACCOUNT METHODS ============
    async linkAccount(account) {
      await linkAccountToUser(account);
      return account;
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await unlinkAccountFromUser(providerAccountId, provider);
    },

    async getAccount(providerAccountId, provider) {
      return await getAccountByProvider(providerAccountId, provider);
    },

    // ============ SESSION METHODS ============
    async createSession({ sessionToken, userId, expires }) {
      await createAuthSession(sessionToken, userId, expires);
      return { sessionToken, userId, expires };
    },

    async getSessionAndUser(sessionToken) {
      const session = await getAuthSession(sessionToken);
      if (!session) return null;

      const expires = new Date(session.expires);
      if (expires < new Date()) {
        await deleteAuthSession(sessionToken);
        return null;
      }

      const user = await findUserById(session.userId);
      if (!user) return null;

      return {
        session: {
          sessionToken,
          userId: session.userId,
          expires
        },
        user: {
          id: user.id,
          email: user.username,
          emailVerified: null,
          name: user.username
        } as AdapterUser
      };
    },

    async updateSession({ sessionToken, expires }) {
      const session = await getAuthSession(sessionToken);
      if (!session) return null;

      await updateAuthSession(sessionToken, expires);

      return {
        sessionToken,
        userId: session.userId,
        expires
      };
    },

    async deleteSession(sessionToken) {
      await deleteAuthSession(sessionToken);
    },

    // ============ AUTHENTICATOR METHODS ============
    async getAuthenticator(credentialID) {
      const passkey = await getPasskeyById(credentialID);
      if (!passkey) return null;

      return {
        credentialID: passkey.cred_id,
        userId: passkey.internal_user_id,
        providerAccountId: passkey.webauthn_user_id || passkey.internal_user_id,
        credentialPublicKey: passkey.cred_public_key,
        counter: passkey.counter || 0,
        credentialDeviceType: passkey.backup_eligible ? 'multiDevice' : 'singleDevice',
        credentialBackedUp: passkey.backup_status || false,
        transports: passkey.transports ? passkey.transports.join(',') : undefined
      };
    },

    async createAuthenticator(authenticator) {
      await createPasskey(authenticator);
      return authenticator;
    },

    async listAuthenticatorsByUserId(userId) {
      const passkeys = await listPasskeysByUserId(userId);

      return passkeys.map((passkey) => ({
        credentialID: passkey.cred_id,
        userId: passkey.internal_user_id,
        providerAccountId: passkey.webauthn_user_id || passkey.internal_user_id,
        credentialPublicKey: passkey.cred_public_key,
        counter: passkey.counter || 0,
        credentialDeviceType: passkey.backup_eligible ? 'multiDevice' : 'singleDevice',
        credentialBackedUp: passkey.backup_status || false,
        transports: passkey.transports ? passkey.transports.join(',') : undefined
      }));
    },

    async updateAuthenticatorCounter(credentialID, counter) {
      await updatePasskeyCounter(credentialID, counter);
    },

    // ============ VERIFICATION TOKEN ============
    async createVerificationToken({ identifier, expires, token }) {
      await createVerificationToken(identifier, token, expires);
      return { identifier, expires, token };
    },

    async useVerificationToken({ identifier, token }) {
      return await useVerificationToken(identifier, token);
    }
  };
}
