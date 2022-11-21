import { Chain } from "@coral-xyz/zeus";
import { HASURA_URL, JWT } from "../config";

const chain = Chain(HASURA_URL, {
  headers: {
    Authorization: `Bearer ${JWT}`,
  },
});

interface Preference {
  notifications: boolean;
  media: boolean;
}

export const insertSubscription = (
  publicKey: string,
  username: string,
  subscription: any
) => {
  return chain("mutation")({
    insert_auth_notification_subscriptions_one: [
      {
        object: {
          public_key: publicKey,
          username,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          expirationTime: subscription.expirationTime || "",
        },
      },
      {
        id: true,
      },
    ],
  });
};

export const getPreferences = async (username: string) => {
  const currentPreferences = await chain("query")({
    auth_xnft_preferences: [
      {
        where: { username: { _eq: username } },
      },
      {
        id: true,
        xnft_id: true,
        notifications: true,
        media: true,
      },
    ],
  });

  return currentPreferences.auth_xnft_preferences.map((x) => ({
    notifications: x.notifications,
    media: x.media,
    xnftId: x.xnft_id,
  }));
};

export const updatePreference = async (
  xnftId: string,
  username: string,
  preferences: Preference
) => {
  //TODO: Fix possible race condition (two creates at same time)
  const currentPreference = await chain("query")({
    auth_xnft_preferences: [
      {
        where: { xnft_id: { _eq: xnftId }, username: { _eq: username } },
        limit: 1,
      },
      {
        id: true,
      },
    ],
  });

  const preference = currentPreference.auth_xnft_preferences?.[0];
  if (preference) {
    await chain("mutation")({
      update_auth_xnft_preferences: [
        {
          _set: {
            notifications: preferences.notifications || false,
            media: preferences.media || false,
          },
          where: { id: { _eq: preference.id } },
        },
        { affected_rows: true },
      ],
    });
  } else {
    await chain("mutation")({
      insert_auth_xnft_preferences_one: [
        {
          object: {
            username,
            xnft_id: xnftId,
            notifications: preferences.notifications || false,
            media: preferences.media || false,
          },
        },
        {
          id: true,
        },
      ],
    });
  }
};
