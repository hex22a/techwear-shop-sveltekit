import type {
  PasskeySerialized,
  User,
  UserCredentials,
  UserWithPasskeyRow
} from '$lib/definitions';
import { db } from '$lib/model/db';
import { formatPgArray } from '$lib/model/helpers';

export async function findUser(username: string): Promise<User> {
  const queryResult = await db.query<User>`SELECT * FROM public.user WHERE username = ${username}`;
  return queryResult.rows[0] || null;
}

export async function findUserById(id: string): Promise<User> {
  const queryResult = await db.query<User>`SELECT * FROM public.user WHERE id = ${id}`;
  return queryResult.rows[0] || null;
}

export async function updateUserById(id: string, username: string): Promise<User> {
  const queryResult = await db.query<User>`
    UPDATE public.user 
    SET username = ${username} 
    WHERE id = ${id} 
    RETURNING *
  `;
  return queryResult.rows[0];
}

export async function deleteUserById(id: string): Promise<void> {
  await db.query`DELETE FROM public.user WHERE id = ${id}`;
}

export async function createUserOnly(username: string): Promise<User> {
  const queryResult = await db.query<User>`
    INSERT INTO public.user (username, created_at) 
    VALUES (${username}, NOW()) 
    RETURNING id, username, created_at
  `;
  return queryResult.rows[0];
}

export async function getAllowCredentials(username: string): Promise<UserCredentials> {
  try {
    const queryResult = await db.query<UserWithPasskeyRow>`
      SELECT
        id,
        username,
        public.user.created_at as created_at,
        passkey.cred_id as cred_id,
        passkey.cred_public_key as cred_public_key,
        passkey.webauthn_user_id as webauthn_user_id,
        passkey.backup_eligible as backup_eligible,
        passkey.backup_status as backup_status,
        passkey.created_at as passkey_created_at,
        passkey.transports as transports,
        passkey.counter as counter,
        passkey.internal_user_id as internal_user_id,
        passkey.last_used as last_used
      FROM public.user
      LEFT JOIN passkey ON public.user.id = passkey.internal_user_id
      WHERE public.user.username = ${username}
    `;
    const user: UserCredentials = {
      passkeys: new Map()
    };
    queryResult.rows.forEach((row) => {
      user.passkeys.set(row.cred_id, {
        id: row.cred_id,
        transports: row.transports
      });
    });
    return user;
  } catch (error) {
    console.error(`Database error: ${error}`);
    throw new Error(`Failed to fetch user: ${username}`);
  }
}

export async function createUser(username: string, passkey: PasskeySerialized): Promise<User> {
  const {
    cred_id,
    counter,
    cred_public_key,
    backup_eligible,
    backup_status,
    webauthn_user_id,
    transports
  } = passkey;
  const formattedTransports = formatPgArray(transports);

  try {
    const queryResult = await db.query<User>`
      WITH new_user AS (
        INSERT INTO public.user (username) VALUES (${username}) RETURNING id, username, created_at
      ),
      new_passkey AS (
        INSERT INTO passkey (
          internal_user_id,
          cred_id,
          counter,
          cred_public_key,
          backup_eligible,
          backup_status,
          webauthn_user_id,
          transports
        )
        VALUES (
          (SELECT id FROM new_user),
          ${cred_id},
          ${counter},
          ${cred_public_key},
          ${backup_eligible},
          ${backup_status},
          ${webauthn_user_id},
          ${formattedTransports}::text[]
        )
        RETURNING 1
      )
      SELECT id, username, created_at FROM new_user;
    `;
    return queryResult.rows[0];
  } catch (error) {
    console.error(`Database error: ${error}`);
    throw new Error(`Failed to create user: ${username}`);
  }
}

export async function getPasskeyWithUserId(
  cred_id: string,
  internal_user_id: string
): Promise<PasskeySerialized> {
  try {
    const queryResult =
      await db.query<PasskeySerialized>`SELECT * FROM passkey WHERE cred_id = ${cred_id} AND internal_user_id = ${internal_user_id}`;
    return queryResult.rows[0];
  } catch (error) {
    console.error(`Database error: ${error}`);
    throw new Error(`Failed to fetch passkey: ${cred_id}`);
  }
}

// ============ NEW METHODS FOR AUTH ADAPTER ============

export async function findUserByAccount(
  providerAccountId: string,
  provider: string
): Promise<User | null> {
  const queryResult = await db.query<User>`
    SELECT u.* 
    FROM public.user u
    JOIN account a ON u.id = a."userId"
    WHERE a."providerAccountId" = ${providerAccountId} AND a.provider = ${provider}
  `;
  return queryResult.rows[0] || null;
}

export async function linkAccountToUser(account: {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
}): Promise<void> {
  await db.query`
    INSERT INTO account (
      "userId", type, provider, "providerAccountId",
      refresh_token, access_token, expires_at, token_type, scope, id_token
    ) VALUES (
      ${account.userId}, 
      ${account.type}, 
      ${account.provider}, 
      ${account.providerAccountId},
      ${account.refresh_token}, 
      ${account.access_token}, 
      ${account.expires_at ? new Date(account.expires_at * 1000) : null},
      ${account.token_type}, 
      ${account.scope}, 
      ${account.id_token}
    )
  `;
}

export async function unlinkAccountFromUser(
  providerAccountId: string,
  provider: string
): Promise<void> {
  await db.query`
    DELETE FROM account 
    WHERE "providerAccountId" = ${providerAccountId} AND provider = ${provider}
  `;
}

export async function getAccountByProvider(providerAccountId: string, provider: string) {
  const queryResult = await db.query`
    SELECT * FROM account 
    WHERE "providerAccountId" = ${providerAccountId} AND provider = ${provider}
  `;
  return queryResult.rows[0] || null;
}

// ============ PASSKEY METHODS ============

export async function getPasskeyById(credentialID: string): Promise<PasskeySerialized | null> {
  const queryResult = await db.query<PasskeySerialized>`
    SELECT * FROM passkey WHERE cred_id = ${credentialID}
  `;
  return queryResult.rows[0] || null;
}

export async function createPasskey(passkey: {
  credentialID: string;
  userId: string;
  providerAccountId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string;
}): Promise<void> {
  const transportsArray = passkey.transports ? passkey.transports.split(',') : [];
  const formattedTransports = formatPgArray(transportsArray);

  await db.query`
    INSERT INTO passkey (
      cred_id, cred_public_key, internal_user_id, webauthn_user_id,
      counter, backup_eligible, backup_status, transports, created_at
    ) VALUES (
      ${passkey.credentialID},
      ${passkey.credentialPublicKey},
      ${passkey.userId},
      ${passkey.providerAccountId},
      ${passkey.counter},
      ${passkey.credentialDeviceType === 'multiDevice'},
      ${passkey.credentialBackedUp},
      ${formattedTransports}::text[],
      NOW()
    )
  `;
}

export async function listPasskeysByUserId(userId: string): Promise<PasskeySerialized[]> {
  const queryResult = await db.query<PasskeySerialized>`
    SELECT * FROM passkey WHERE internal_user_id = ${userId}
  `;
  return queryResult.rows;
}

export async function updatePasskeyCounter(credentialID: string, counter: number): Promise<void> {
  await db.query`
    UPDATE passkey 
    SET counter = ${counter}, last_used = NOW() 
    WHERE cred_id = ${credentialID}
  `;
}
