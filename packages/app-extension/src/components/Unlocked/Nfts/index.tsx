import { useMemo } from "react";
import type { Blockchain, NftCollection } from "@coral-xyz/common";
import { Loading } from "@coral-xyz/react-common";
import {
  nftCollections,
  useActiveWallets,
  useEnabledBlockchains,
  useLoader,
} from "@coral-xyz/recoil";
import { Image as ImageIcon } from "@mui/icons-material";
import type { UnwrapRecoilValue } from "recoil";
import { RecoilValue, selectorFamily, useRecoilValue } from "recoil";

import { useIsONELive } from "../../../hooks/useIsONELive";
import { EmptyState } from "../../common/EmptyState";
import {} from "../Balances";

import EntryONE from "./EntryONE";
import { NftTable } from "./NftTable";

export function Nfts() {
  const isONELive = useIsONELive();
  const activeWallets = useActiveWallets();
  const enabledBlockchains = useEnabledBlockchains();
  const [collections, _, isLoading] = useLoader<
    UnwrapRecoilValue<typeof nftCollections> | { [k: string]: null }
  >(
    nftCollections,
    Object.fromEntries(enabledBlockchains.map((b: Blockchain) => [b, null])),
    // Note this reloads on any change to the active wallets, which reloads
    // NFTs for both blockchains.
    // TODO Make this reload for only the relevant blockchain
    [activeWallets]
  );

  // const collections = {..._collections, ethereum: []};
  // const collections = Object.fromEntries(
  //   enabledBlockchains.map((b: Blockchain) => [b, null])
  // );
  const NFTList = useMemo(() => {
    return (
      <NftTable
        prependItems={
          isONELive
            ? [{ height: 129, key: "oneEntry", component: <EntryONE /> }]
            : []
        }
        blockchainCollections={Object.entries(collections)}
      />
    );
  }, [isONELive, JSON.stringify(collections)]);

  const isEmpty =
    false || (Object.values(collections).flat().length === 0 && !isLoading);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {isEmpty ? (
        <>
          {isONELive && <EntryONE />}
          <EmptyState
            icon={(props: any) => <ImageIcon {...props} />}
            title={"No NFTs"}
            subtitle={"Get started with your first NFT"}
            buttonText={"Browse Magic Eden"}
            onClick={() => window.open("https://magiceden.io")}
            verticallyCentered={!isONELive}
          />
        </>
      ) : (
        <div style={{ display: "flex", flex: 1, position: "relative" }}>
          {NFTList}
        </div>
      )}
    </div>
  );
}
