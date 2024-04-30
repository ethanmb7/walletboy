import { useEffect, useState } from "react";
import type { Blockchain } from "@coral-xyz/common";
import { InputListItem, Inputs, PrimaryButton } from "@coral-xyz/react-common";
import {
  blockchainConfigAtom,
  secureUserAtom,
  useBackgroundClient,
} from "@coral-xyz/recoil";
import { useRecoilValue } from "recoil";

import { changeNetwork } from "./ConnectionSwitch";

export function PreferenceBlockchainCustomRpcUrl({
  blockchain,
}: {
  blockchain: Blockchain;
}) {
  const background = useBackgroundClient();
  const user = useRecoilValue(secureUserAtom);
  const currentURL = user.preferences.blockchains[blockchain]?.connectionUrl;
  const currentChainId =
    user.preferences.blockchains[blockchain]?.chainId ?? "";
  const [rpcUrl, setRpcUrl] = useState(currentURL);
  const [chainId, setChainId] = useState(currentChainId);
  const blockchainConfig = useRecoilValue(blockchainConfigAtom(blockchain));
  const requiresChainId = blockchainConfig.requiresChainId;

  const [rpcUrlError, setRpcUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(isLoading || !rpcUrl || rpcUrlError);
  }, [isLoading, rpcUrl, rpcUrlError]);

  const verifySolanaRPC = (validUrl: string) => {
    setIsLoading(true);
    fetch(validUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getHealth",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error.message);
        }
        setRpcUrlError(false);
        setIsLoading(false);
      })
      .catch((_error) => {
        setRpcUrlError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!rpcUrl) {
        setRpcUrlError(false);
        setIsLoading(false);
        return;
      }
      try {
        new URL(rpcUrl.trim());
        !requiresChainId && verifySolanaRPC(rpcUrl.trim());
      } catch (e: any) {
        setRpcUrlError(true);
        setIsLoading(false);
      }
    }, 500); // Debounce time: 500ms

    return () => clearTimeout(debounceTimer);
  }, [rpcUrl, requiresChainId]);

  return (
    <div style={{ paddingTop: "16px", height: "100%" }}>
      <form
        onSubmit={() =>
          changeNetwork(
            background,
            blockchain,
            rpcUrl,
            requiresChainId ? chainId : undefined
          )
        }
        style={{ display: "flex", height: "100%", flexDirection: "column" }}
      >
        <div style={{ flex: 1, flexGrow: 1 }}>
          <Inputs error={rpcUrlError}>
            <InputListItem
              isFirst
              isLast
              button={false}
              title="RPC"
              placeholder="RPC URL"
              value={rpcUrl}
              onChange={(e) => {
                setRpcUrl(e.target.value);
              }}
            />
            {requiresChainId ? (
              <InputListItem
                isLast
                isFirst={false}
                button={false}
                title="Chain"
                placeholder="Chain ID"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
              />
            ) : null}
          </Inputs>
        </div>
        <div style={{ padding: 16 }}>
          <PrimaryButton
            disabled={isButtonDisabled}
            label={
              isLoading
                ? "Loading..."
                : !rpcUrl || rpcUrlError
                  ? "Invalid URL"
                  : "Switch"
            }
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
