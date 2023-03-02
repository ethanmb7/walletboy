import type { Blockchain } from "@coral-xyz/common";
import { AVATAR_BASE_URL } from "@coral-xyz/common";
import { Chain } from "@coral-xyz/zeus";
import { v4 as uuidv4 } from "uuid";

import { HASURA_URL, JWT } from "../config";

import { updatePublicKey } from "./publicKey";

const chain = Chain(HASURA_URL, {
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});

export const getUsers = async (
  userIds: string[]
): Promise<
  {
    username: unknown;
    id: unknown;
    publicKeys: unknown[];
  }[]
> => {
  const response = await chain("query")({
    auth_users: [
      {
        where: { id: { _in: userIds } },
      },
      {
        id: true,
        username: true,
        public_keys: [
          {},
          {
            blockchain: true,
            id: true,
            public_key: true,
            user_active_publickey_mappings: [{}, { user_id: true }],
          },
        ],
      },
    ],
  });
  return transformUsers(response.auth_users, true);
};

/**
 * Look up user IDs for multiple blockchain/public key pairs.
 */
export const getUsersByPublicKeys = async (
  blockchainPublicKeys: Array<{ blockchain: Blockchain; publicKey: string }>
): Promise<
  Array<{ user_id?: unknown; blockchain: string; public_key: unknown }>
> => {
  const response = await chain("query")({
    auth_public_keys: [
      {
        where: {
          // Only matching public keys here, but it should be checking
          // blockchain AND public key as the same public key will be used
          // for different blockchains (particularly EVM)
          public_key: { _in: blockchainPublicKeys.map((b) => b.publicKey) },
        },
        limit: 100,
      },
      {
        user_id: true,
        public_key: true,
        blockchain: true,
      },
    ],
  });

  // Filter again to make sure the blockchain/public key pair match. It might
  // be possible to do this in graphql query?
  const result = response.auth_public_keys.filter((r) => {
    return blockchainPublicKeys.some(
      (b) =>
        b.publicKey === r.public_key &&
        (b.blockchain as Blockchain) === r.blockchain
    );
  });

  return result;
};

/**
 * Get a user by their username.
 */
export const getUserByUsername = async (username: string) => {
  const response = await chain("query")({
    auth_users: [
      {
        where: { username: { _eq: username } },
      },
      {
        id: true,
        username: true,
        public_keys: [
          {},
          {
            blockchain: true,
            id: true,
            public_key: true,
            user_active_publickey_mappings: [{}, { user_id: true }],
          },
        ],
      },
    ],
  });
  if (!response.auth_users[0]) {
    throw new Error("user not found");
  }
  return transformUser(response.auth_users[0]);
};

/**
 * Get a user by their id.
 */
export const getUser = async (id: string, onlyActiveKeys?: boolean) => {
  const response = await chain("query")({
    auth_users_by_pk: [
      {
        id,
      },
      {
        id: true,
        username: true,
        public_keys: [
          {},
          {
            blockchain: true,
            id: true,
            public_key: true,
            user_active_publickey_mappings: [{}, { user_id: true }],
          },
        ],
      },
    ],
  });
  if (!response.auth_users_by_pk) {
    throw new Error("user not found");
  }
  return transformUser(response.auth_users_by_pk, onlyActiveKeys);
};

export const getReferrer = async (userId: string) => {
  const { auth_users_by_pk } = await chain("query")({
    auth_users_by_pk: [
      {
        id: userId,
      },
      {
        referrer: {
          id: true,
          username: true,
        },
      },
    ],
  });
  return auth_users_by_pk?.referrer;
};

const transformUsers = (
  users: {
    id: unknown;
    username: unknown;
    public_keys: Array<{
      blockchain: string;
      public_key: string;
      user_active_publickey_mappings?: { user_id: string }[];
    }>;
  }[],
  onlyActiveKeys?: boolean
) => {
  return users.map((x) => transformUser(x, onlyActiveKeys));
};
/**
 * Utility method to format a user for responses from a raw user object.
 */
const transformUser = (
  user: {
    id: unknown;
    username: unknown;
    public_keys: Array<{
      blockchain: string;
      public_key: string;
      user_active_publickey_mappings?: { user_id: string }[];
    }>;
  },
  onlyActiveKeys?: boolean
) => {
  return {
    id: user.id,
    username: user.username,
    // Camelcase public keys for response
    publicKeys: user.public_keys
      .map((k) => ({
        blockchain: k.blockchain as Blockchain,
        publicKey: k.public_key,
        primary:
          k.user_active_publickey_mappings?.length || 0 >= 1 ? true : false,
      }))
      .filter((x) => {
        if (onlyActiveKeys && !x.primary) {
          return false;
        }
        return true;
      }),
    image: `${AVATAR_BASE_URL}/${user.username}`,
  };
};

/**
 * Create a user
 */
export const createUser = async (
  username: string,
  blockchainPublicKeys: Array<{ blockchain: Blockchain; publicKey: string }>,
  waitlistId?: string | null,
  referrerId?: string
): Promise<{
  id: string;
  username: string;
  public_keys: { blockchain: "solana" | "ethereum"; id: number }[];
}> => {
  const inviteCode = uuidv4();
  await chain("mutation")({
    insert_auth_invitations_one: [
      {
        object: {
          id: inviteCode,
        },
      },
      {
        id: true,
      },
    ],
  });

  const response = await chain("mutation")({
    insert_auth_users_one: [
      {
        object: {
          username: username,
          public_keys: {
            data: blockchainPublicKeys.map((b) => ({
              blockchain: b.blockchain,
              public_key: b.publicKey,
            })),
          },
          invitation_id: inviteCode,
          waitlist_id: waitlistId,
          referrer_id: referrerId,
        },
      },
      {
        id: true,
        username: true,
        public_keys: [
          {},
          {
            blockchain: true,
            id: true,
            public_key: true,
            user_active_publickey_mappings: [{}, { user_id: true }],
          },
        ],
      },
    ],
  });

  // @ts-ignore
  return response.insert_auth_users_one;
};

/**
 * Search for users by prefix.
 */
export async function getUsersByPrefix({
  usernamePrefix,
  uuid,
  limit,
}: {
  usernamePrefix: string;
  uuid: string;
  limit?: number;
}): Promise<{ username: string; id: string }[]> {
  const response = await chain("query")({
    auth_users: [
      {
        where: {
          username: { _like: `${usernamePrefix}%` },
          id: { _neq: uuid },
        },
        //@ts-ignore
        order_by: [{ username: "asc" }],
        limit: limit || 25,
      },
      {
        id: true,
        username: true,
      },
    ],
  });

  return response.auth_users || [];
}

/**
 * Delete a public key/blockchain from a user.
 */

export async function deleteUserPublicKey({
  userId,
  blockchain,
  publicKey,
}: {
  userId: string;
  blockchain: Blockchain;
  publicKey: string;
}) {
  const response = await chain("mutation")({
    delete_auth_public_keys: [
      {
        where: {
          user_id: { _eq: userId },
          blockchain: { _eq: blockchain },
          public_key: { _eq: publicKey },
        },
      },
      {
        affected_rows: true,
      },
    ],
  });

  return response.delete_auth_public_keys;
}

/**
 * Add a public key/blockchain to a user.
 */
export async function createUserPublicKey({
  userId,
  blockchain,
  publicKey,
}: {
  userId: string;
  blockchain: Blockchain;
  publicKey: string;
}) {
  const response = await chain("mutation")({
    insert_auth_public_keys_one: [
      {
        object: {
          user_id: userId,
          blockchain: blockchain as string,
          public_key: publicKey,
        },
      },
      {
        id: true,
      },
    ],
  });

  const publicKeyId = response.insert_auth_public_keys_one?.id;
  if (publicKeyId) {
    await updatePublicKey({
      userId: userId,
      blockchain: blockchain,
      publicKeyId,
      onlyInsert: true,
    });
  }

  return response.insert_auth_public_keys_one;
}

/**
 * Update avatar_nft of a user.
 */
export async function updateUserAvatar({
  userId,
  avatar,
}: {
  userId: string;
  avatar: string | null;
}) {
  const response = await chain("mutation")({
    update_auth_users: [
      {
        where: {
          id: { _eq: userId },
        },
        _set: {
          avatar_nft: avatar,
        },
      },
      {
        affected_rows: true,
      },
    ],
  });

  return response.update_auth_users;
}

export const getUserByPublicKeyAndChain = async (
  publicKey: string,
  blockchain: Blockchain
): Promise<
  {
    id: string;
    username: string;
  }[]
> => {
  const response = await chain("query")({
    auth_users: [
      {
        where: {
          public_keys: {
            blockchain: { _eq: blockchain },
            public_key: { _eq: publicKey },
            user_active_publickey_mappings: {
              blockchain: { _eq: blockchain },
              public_key: {
                public_key: { _eq: publicKey },
              },
            },
          },
        },
      },
      {
        id: true,
        username: true,
      },
    ],
  });

  return response.auth_users || [];
};
