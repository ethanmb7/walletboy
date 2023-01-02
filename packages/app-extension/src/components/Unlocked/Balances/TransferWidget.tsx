import type { Blockchain } from "@coral-xyz/common";
import {
  ETH_NATIVE_MINT,
  SOL_NATIVE_MINT,
  STRIPE_ENABLED,
} from "@coral-xyz/common";
import { Dollar } from "@coral-xyz/react-common";
import {
  SwapProvider,
  useActiveSolanaWallet,
  useFeatureGates,
} from "@coral-xyz/recoil";
import { useCustomTheme } from "@coral-xyz/themes";
import { ArrowDownward, ArrowUpward, SwapHoriz } from "@mui/icons-material";
import { Typography } from "@mui/material";

import { useNavStack } from "../../common/Layout/NavStack";
import type { Token } from "../../common/TokenTable";
import { SearchableTokenTables } from "../../common/TokenTable";
import { Swap, SwapSelectToken } from "../../Unlocked/Swap";

import { Deposit } from "./TokensWidget/Deposit";
import { Ramp } from "./TokensWidget/Ramp";
import { Send, SendLoader } from "./TokensWidget/Send";
import { WithHeaderButton } from "./TokensWidget/Token";
import { StripeRamp } from "./StripeRamp";

export function TransferWidget({
  blockchain,
  address,
  publicKey,
  rampEnabled,
  swapEnabled,
}: {
  blockchain?: Blockchain;
  address?: string;
  publicKey?: string;
  rampEnabled: boolean;
  swapEnabled: boolean;
}) {
  const featureGates = useFeatureGates();
  const enableOnramp =
    featureGates && featureGates[STRIPE_ENABLED] && rampEnabled;

  return (
    <div
      style={{
        display: "flex",
        width:
          enableOnramp && swapEnabled
            ? "256px"
            : swapEnabled || enableOnramp
            ? "188px"
            : "120px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {enableOnramp && (
        <>
          <RampButton blockchain={blockchain} address={address} />
          <div style={{ width: "16px" }} />
        </>
      )}
      <ReceiveButton blockchain={blockchain} publicKey={publicKey} />
      <div style={{ width: "16px" }} />
      <SendButton
        blockchain={blockchain}
        address={address}
        publicKey={publicKey}
      />
      {swapEnabled && (
        <>
          <div style={{ width: "16px" }} />
          <SwapButton
            blockchain={blockchain}
            address={address}
            publicKey={publicKey}
          />
        </>
      )}
    </div>
  );
}

function SwapButton({
  blockchain,
  address,
  publicKey,
}: {
  blockchain?: Blockchain;
  address?: string;
  publicKey?: string;
}) {
  const theme = useCustomTheme();
  // Aggregate view swapper can just default to the current (global) active key.
  publicKey = publicKey ?? useActiveSolanaWallet().publicKey;

  return (
    <SwapProvider tokenAddress={address} publicKey={publicKey}>
      <TransferButton
        label={"Swap"}
        labelComponent={
          <SwapHoriz
            style={{
              color: theme.custom.colors.fontColor,
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        }
        routes={[
          {
            name: "swap",
            component: (props: any) => <Swap {...props} />,
            title: `Swap`,
            props: {
              blockchain,
            },
          },
          {
            title: `Select Token`,
            name: "select-token",
            component: (props: any) => <SwapSelectToken {...props} />,
          },
        ]}
      />
    </SwapProvider>
  );
}

function SendButton({
  blockchain,
  address,
  publicKey,
}: {
  blockchain?: Blockchain;
  address?: string;
  publicKey?: string;
}) {
  const theme = useCustomTheme();
  return (
    <TransferButton
      label={"Send"}
      labelComponent={
        <ArrowUpward
          style={{
            color: theme.custom.colors.fontColor,
            display: "flex",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      }
      routes={
        blockchain && address
          ? [
              {
                name: "send",
                component: (props: any) => <SendLoader {...props} />,
                title: `Send`,
                props: {
                  blockchain,
                  address,
                  publicKey,
                },
              },
            ]
          : [
              {
                name: "select-token",
                component: SendToken,
                title: "Select Token",
              },
              {
                name: "send",
                component: (props: any) => <Send {...props} />,
                title: "",
              },
            ]
      }
    />
  );
}

function ReceiveButton({
  blockchain,
  publicKey,
}: {
  blockchain?: Blockchain;
  publicKey?: string;
}) {
  const theme = useCustomTheme();
  return (
    <TransferButton
      label={"Receive"}
      labelComponent={
        <ArrowDownward
          style={{
            color: theme.custom.colors.fontColor,
            display: "flex",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      }
      routes={[
        {
          component: Deposit,
          title: "Deposit",
          name: "deposit",
          props: {
            blockchain,
            publicKey,
          },
        },
      ]}
    />
  );
}

function RampButton({
  blockchain,
  address,
}: {
  blockchain?: Blockchain;
  address?: string;
}) {
  const theme = useCustomTheme();
  return (
    <TransferButton
      label={"Buy"}
      labelComponent={
        <Dollar
          fill={theme.custom.colors.fontColor}
          style={{
            display: "flex",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      }
      routes={
        blockchain && address
          ? [
              {
                name: "stripe",
                component: (props: any) => <StripeRamp {...props} />,
                title: "Buy",
                props: {
                  blockchain,
                  publicKey: address,
                },
              },
            ]
          : [
              {
                component: Ramp,
                title: "Buy",
                name: "onramp",
                props: {
                  blockchain,
                  publicKey: address,
                },
              },
              {
                component: (props: any) => <StripeRamp {...props} />,
                title: "Buy using Link",
                name: "stripe",
              },
            ]
      }
    />
  );
}

function TransferButton({
  label,
  labelComponent,
  routes,
}: {
  label: string;
  labelComponent: any;
  routes: Array<{ props?: any; component: any; title: string; name: string }>;
}) {
  const theme = useCustomTheme();
  return (
    <div
      style={{
        width: "52px",
        height: "70px",
      }}
    >
      <WithHeaderButton
        style={{
          padding: 0,
          width: "42px",
          height: "42px",
          minWidth: "42px",
          borderRadius: "21px",
          boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.15)",
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
          marginBottom: "8px",
        }}
        label={""}
        labelComponent={labelComponent}
        routes={routes}
      />
      <Typography
        style={{
          color: theme.custom.colors.secondary,
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "20px",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    </div>
  );
}

function SendToken() {
  const { push } = useNavStack();

  const onClickRow = (blockchain: Blockchain, token: Token) => {
    push("send", { blockchain, token });
  };

  return (
    <SearchableTokenTables
      onClickRow={onClickRow}
      customFilter={(token: Token) => {
        if (token.mint && token.mint === SOL_NATIVE_MINT) {
          return true;
        }
        if (token.address && token.address === ETH_NATIVE_MINT) {
          return true;
        }
        return !token.nativeBalance.isZero();
      }}
    />
  );
}
