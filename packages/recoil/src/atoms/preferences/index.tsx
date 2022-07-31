import { atom, selector } from "recoil";
import { Commitment } from "@solana/web3.js";
import {
  UI_RPC_METHOD_KEYRING_AUTOLOCK_READ,
  UI_RPC_METHOD_APPROVED_ORIGINS_READ,
  UI_RPC_METHOD_SOLANA_EXPLORER_READ,
  UI_RPC_METHOD_SOLANA_COMMITMENT_READ,
} from "@coral-xyz/common";
import { backgroundClient } from "../client";

/**
 * Toggle for darkmode.
 */
// TODO: enable this.
// not being used in theme right now due to circular imports,
// see packages/themes/src/index.tsx for details
export const isDarkMode = atom<boolean | null>({
  key: "isDarkMode",
  default: true,
  /*
  effects: [
    ({ setSelf }) => {
      const background = getBackgroundClient();
      setSelf(
        background.request({
          method: UI_RPC_METHOD_SETTINGS_DARK_MODE_READ,
          params: [],
        })
      );
    },
    ({ onSet }) => {
      onSet((darkMode: boolean | null) => {
        const background = getBackgroundClient();
        background
          .request({
            method: UI_RPC_METHOD_SETTINGS_DARK_MODE_UPDATE,
            params: [darkMode],
          })
          .catch(console.error);
      });
    },
  ],
	*/
});

export const autoLockSecs = atom<number | null>({
  key: "autoLockSecs",
  default: selector({
    key: "autoLockSecsDefault",
    get: async ({ get }) => {
      const background = get(backgroundClient);
      return await background.request({
        method: UI_RPC_METHOD_KEYRING_AUTOLOCK_READ,
        params: [],
      });
    },
  }),
});

export const approvedOrigins = atom<Array<string> | null>({
  key: "approvedOrigins",
  default: selector({
    key: "approvedOriginsDefault",
    get: async ({ get }) => {
      const background = get(backgroundClient);
      return await background.request({
        method: UI_RPC_METHOD_APPROVED_ORIGINS_READ,
        params: [],
      });
    },
  }),
});

export const solanaExplorer = atom<string | null>({
  key: "solanaExplorer",
  default: selector({
    key: "solanaExplorerDefault",
    get: async ({ get }) => {
      const background = get(backgroundClient);
      return await background.request({
        method: UI_RPC_METHOD_SOLANA_EXPLORER_READ,
        params: [],
      });
    },
  }),
});

export const solanaCommitment = atom<Commitment | null>({
  key: "solanaCommitment",
  default: selector({
    key: "solanaCommitmentDefault",
    get: async ({ get }) => {
      const background = get(backgroundClient);
      return await background.request({
        method: UI_RPC_METHOD_SOLANA_COMMITMENT_READ,
        params: [],
      });
    },
  }),
});
