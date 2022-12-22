import React, { useMemo, useState } from "react";
import type { Blockchain, NftCollectionWithIds } from "@coral-xyz/common";
import { BACKEND_API_URL } from "@coral-xyz/common";
import {
  EmptyState,
  ImageIcon,
  Loading,
  PrimaryButton,
  ProxyImage,
  SecondaryButton,
} from "@coral-xyz/react-common";
import {
  newAvatarAtom,
  nftById,
  nftCollectionsWithIds,
  useAvatarUrl,
  useUser,
} from "@coral-xyz/recoil";
import { styled, useCustomTheme } from "@coral-xyz/themes";
import { CircularProgress, Grid } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";

import { Scrollbar } from "../../../common/Layout/Scrollbar";

import { BlockchainHeader } from "./BlockchainHeader";

type tempAvatar = {
  url: string;
  id: string;
};

export function UpdateProfilePicture({
  setOpenDrawer,
}: {
  setOpenDrawer: (open: boolean) => void;
}) {
  const [tempAvatar, setTempAvatar] = useState<tempAvatar | null>(null);
  const [loading, setLoading] = useState(false);
  const avatarUrl = useAvatarUrl();
  const { username } = useUser();
  const setNewAvatar = useSetRecoilState(newAvatarAtom(username));
  const theme = useCustomTheme();
  const { contents, state } = useRecoilValueLoadable(nftCollectionsWithIds);
  const collections = (state === "hasValue" && contents) || null;

  const numberOfNFTs = Object.entries(collections ?? {}).reduce(
    (acc, [, collection]) => acc + (collection ?? []).length,
    0
  );
  return (
    <Container>
      <AvatarWrapper>
        <Avatar src={tempAvatar?.url || avatarUrl} />
      </AvatarWrapper>
      <Typography
        style={{
          textAlign: "center",
          color: theme.custom.colors.fontColor,
        }}
      >{`@${username}`}</Typography>
      <FakeDrawer>
        <Scrollbar
          style={{
            height: "100%",
            background: theme.custom.colors.nav,
          }}
        >
          {state === "loading" ? (
            <Loading size={50} />
          ) : numberOfNFTs === 0 ? (
            <EmptyState
              icon={(props: any) => <ImageIcon {...props} />}
              title={"No NFTs to use"}
              subtitle={"Get started with your first NFT"}
              onClick={() => window.open("https://magiceden.io/")}
              contentStyle={{
                marginBottom: 0,
                color: "inherit",
                border: "none",
              }}
              buttonText={"Browse Magic Eden"}
            />
          ) : (
            <div
              style={{
                paddingBottom: tempAvatar ? "80px" : "0px",
                transition: "padding ease-out 200ms",
              }}
            >
              {Object.entries(collections ?? {}).map(
                ([blockchain, collection]) => (
                  <BlockchainNFTs
                    key={blockchain}
                    blockchain={blockchain as Blockchain}
                    collections={collection as NftCollectionWithIds[]}
                    isLoading={false}
                    tempAvatar={tempAvatar}
                    setTempAvatar={setTempAvatar}
                  />
                )
              )}
            </div>
          )}
        </Scrollbar>
      </FakeDrawer>
      <ButtonsOverlay
        style={{
          maxHeight: tempAvatar ? "100px" : "0px",
        }}
      >
        <SecondaryButton
          label={"Cancel"}
          onClick={() => {
            setTempAvatar(null);
          }}
          style={{
            margin: "16px",
          }}
        />
        <PrimaryButton
          label={
            loading ? (
              <CircularProgress
                size={24}
                sx={{ color: "white", display: "flex", alignSelf: "center" }}
              />
            ) : (
              "Update"
            )
          }
          onClick={async () => {
            if (tempAvatar) {
              setLoading(true);
              await fetch(BACKEND_API_URL + "/users/avatar", {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ avatar: tempAvatar.id }),
              });
              await fetch(
                "https://swr.xnfts.dev/avatars/" + username + "?bust_cache=1"
              ); // bust edge cache
              setNewAvatar(tempAvatar);
              setTempAvatar(null);
              setOpenDrawer(false);
            }
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "16px",
            marginLeft: "0px",
          }}
        />
      </ButtonsOverlay>
    </Container>
  );
}

const BlockchainNFTs = React.memo(function BlockchainNFTs({
  blockchain,
  collections,
  isLoading,
  tempAvatar,
  setTempAvatar,
}: {
  blockchain: Blockchain;
  collections: NftCollectionWithIds[];
  isLoading: boolean;
  tempAvatar: tempAvatar | null;
  setTempAvatar: (tempAvatar: tempAvatar) => void;
}) {
  const [showContent, setShowContent] = useState(true);

  const nftsIds = collections.reduce<string[]>((flat, collection) => {
    flat.push(...collection.items);
    return flat;
  }, []);

  if (!isLoading && collections.length === 0) {
    return null;
  }

  return (
    <>
      <BlockchainHeader
        setShowContent={setShowContent}
        showContent={showContent}
        blockchain={blockchain}
      />
      <Collapse in={showContent}>
        <Grid
          container
          style={{ padding: "12px 16px 16px 16px" }}
          spacing={{ xs: 2, ms: 2, md: 2, lg: 2 }}
        >
          {nftsIds.map((nftId) => (
            <RenderNFT
              key={nftId}
              nftId={nftId}
              tempAvatar={tempAvatar}
              setTempAvatar={setTempAvatar}
            />
          ))}
        </Grid>
      </Collapse>
    </>
  );
});

function RenderNFT({
  nftId,
  tempAvatar,
  setTempAvatar,
}: {
  nftId: string;
  setTempAvatar: (tempAvatar: tempAvatar) => void;
  tempAvatar: tempAvatar | null;
}) {
  const { contents, state } = useRecoilValueLoadable(nftById(nftId));
  const nft = (state === "hasValue" && contents) || null;

  return useMemo(
    () =>
      !nft ? null : (
        <StyledProxyImage
          key={nftId}
          onClick={() => {
            console.log(nft);

            const avatarId =
              nft.blockchain === "solana"
                ? // @ts-ignore
                  nft.mint
                : nft.id;

            setTempAvatar({
              url: nft.imageUrl,
              id: `${nft.blockchain}/${avatarId}`,
            });
          }}
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "40px",
            margin: "16px 0px 0px 16px",
            border: tempAvatar?.url === nft.imageUrl ? "3px solid black" : "",
          }}
          src={nft.imageUrl}
          removeOnError={true}
        />
      ),
    [nft]
  );
}

const Container = styled("div")(() => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
}));

const StyledProxyImage = styled(ProxyImage)(({ theme }) => ({
  "&:hover": {
    border: `3px solid ${theme.custom.colors.avatarIconBackground}`,
    cursor: "pointer",
  },
}));

const FakeDrawer = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  backgroundColor: theme.custom.colors.nav,
  flex: 1,
  borderTop: `${theme.custom.colors.borderFull}`,
  paddingBottom: "0px",
  paddingTop: "0px",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  marginTop: "16px",
  zIndex: "0",
  overflow: "hidden",
}));
const ButtonsOverlay = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "0px",
  display: "flex",
  zIndex: "1",
  background: theme.custom.colors.nav,
  alignItems: "stretch",
  width: "100%",
  transition: "max-height ease-out 200ms",
}));

const Avatar = styled(ProxyImage)(() => ({
  borderRadius: "40px",
  width: "64px",
  height: "64px",
  marginLeft: "auto",
  marginRight: "auto",
  display: "block",
  zIndex: 0,
}));

const AvatarWrapper = styled("div")(({ theme }) => ({
  boxSizing: "border-box",
  position: "relative",
  borderRadius: "50px",
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='${encodeURIComponent(
    theme.custom.colors.avatarIconBackground
  )}' stroke-width='5' stroke-dasharray='8%25%2c 13%25' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
  padding: "6px",
  width: "82px",
  height: "82px",
  marginLeft: "auto",
  marginRight: "auto",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover .editOverlay": {
    visibility: "visible",
  },
}));
