import type { Connection } from "@solana/web3.js";
import type { BigNumber } from "ethers";

import { useState } from "react";
import { View, Text } from "react-native";

import { programs, tryGetAccount } from "@cardinal/token-manager";
import {
  Blockchain,
  confirmTransaction,
  SOL_NATIVE_MINT,
  Solana,
  walletAddressDisplay,
} from "@coral-xyz/common";
import { useSolanaCtx } from "@coral-xyz/recoil";
import { SettingsList } from "@screens/Unlocked/Settings/components/SettingsMenuList";
import { PublicKey } from "@solana/web3.js";

import {
  Error,
  Sending,
  Header,
  Container,
} from "@components/BottomDrawerCards";
import { Margin, PrimaryButton, TokenAmountHeader } from "@components/index";
import { useTheme } from "@hooks/index";

export function SendSolanaConfirmationCard({
  token,
  destinationAddress,
  amount,
  onComplete,
}: {
  token: {
    address: string;
    logo: string;
    decimals: number;
    tokenId?: string;
    mint?: string;
  };
  destinationAddress: string;
  amount: BigNumber;
  onComplete?: () => void;
}): JSX.Element {
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const solanaCtx = useSolanaCtx();
  const [error, setError] = useState(
    "Error 422. Transaction time out. Runtime error. Reticulating splines."
  );
  const [cardType, setCardType] = useState<
    "confirm" | "sending" | "complete" | "error"
  >("confirm");

  const onConfirm = async () => {
    setCardType("sending");
    //
    // Send the tx.
    //
    let txSig;
    try {
      if (token.mint === SOL_NATIVE_MINT.toString()) {
        txSig = await Solana.transferSol(solanaCtx, {
          source: solanaCtx.walletPublicKey,
          destination: new PublicKey(destinationAddress),
          amount: amount.toNumber(),
        });
      } else if (
        await isCardinalWrappedToken(
          solanaCtx.connection,
          token.mint?.toString() as string
        )
      ) {
        txSig = await Solana.transferCardinalToken(solanaCtx, {
          destination: new PublicKey(destinationAddress),
          mint: new PublicKey(token.mint!),
          amount: amount.toNumber(),
          decimals: token.decimals,
        });
      } else {
        txSig = await Solana.transferToken(solanaCtx, {
          destination: new PublicKey(destinationAddress),
          mint: new PublicKey(token.mint!),
          amount: amount.toNumber(),
          decimals: token.decimals,
        });
      }
    } catch (err: any) {
      setError(err.toString());
      setCardType("error");
      return;
    }

    setTxSignature(txSig);

    //
    // Confirm the tx.
    //
    try {
      await confirmTransaction(
        solanaCtx.connection,
        txSig,
        solanaCtx.commitment !== "confirmed" &&
          solanaCtx.commitment !== "finalized"
          ? "confirmed"
          : solanaCtx.commitment
      );
      setCardType("complete");
      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      setError(err.toString());
      setCardType("error");
    }
  };

  return (
    <>
      {cardType === "confirm" ? (
        <ConfirmSendSolana
          token={token}
          destinationAddress={destinationAddress}
          amount={amount}
          onConfirm={onConfirm}
        />
      ) : cardType === "sending" ? (
        <Sending
          blockchain={Blockchain.SOLANA}
          isComplete={false}
          amount={amount}
          token={token}
          signature={txSignature!}
        />
      ) : cardType === "complete" ? (
        <Sending
          blockchain={Blockchain.SOLANA}
          isComplete
          amount={amount}
          token={token}
          signature={txSignature!}
        />
      ) : (
        <Error
          blockchain={Blockchain.SOLANA}
          signature={txSignature!}
          onRetry={onConfirm}
          error={error}
        />
      )}
    </>
  );
}

export function ConfirmSendSolana({
  token,
  destinationAddress,
  amount,
  onConfirm,
}: {
  token: {
    logo?: string;
    ticker?: string;
    decimals: number;
  };
  destinationAddress: string;
  amount: BigNumber;
  onConfirm: () => void;
}) {
  return (
    <Container>
      <Header text="Review Send" />
      <Margin vertical={24}>
        <TokenAmountHeader amount={amount} token={token} />
      </Margin>
      <Margin bottom={24}>
        <ConfirmSendSolanaTable destinationAddress={destinationAddress} />
      </Margin>
      <PrimaryButton onPress={() => onConfirm()} label="Send" />
    </Container>
  );
}

const ConfirmSendSolanaTable: React.FC<{
  destinationAddress: string;
}> = ({ destinationAddress }) => {
  const theme = useTheme();
  const solanaCtx = useSolanaCtx();

  const menuItems = {
    From: {
      disabled: true,
      onPress: () => {},
      detail: <Text>{walletAddressDisplay(solanaCtx.walletPublicKey)}</Text>,
    },
    To: {
      disabled: true,
      onPress: () => {},
      detail: <Text>{walletAddressDisplay(destinationAddress)}</Text>,
    },
    "Network fee": {
      disabled: true,
      onPress: () => {},
      detail: (
        <Text>
          <Text>0.000005</Text>
          <Text style={{ color: theme.custom.colors.secondary }}>SOL</Text>
        </Text>
      ),
    },
  };

  return (
    <SettingsList
      borderColor={theme.custom.colors.approveTransactionTableBackground}
      menuItems={menuItems}
    />
  );
};

// TODO(peter) share between mobile/extension
const isCardinalWrappedToken = async (
  connection: Connection,
  tokenAddress: string
) => {
  const [tokenManagerId] =
    await programs.tokenManager.pda.findTokenManagerAddress(
      new PublicKey(tokenAddress)
    );
  const tokenManagerData = await tryGetAccount(() =>
    programs.tokenManager.accounts.getTokenManager(connection, tokenManagerId)
  );
  if (tokenManagerData?.parsed && tokenManagerData?.parsed.transferAuthority) {
    try {
      programs.transferAuthority.accounts.getTransferAuthority(
        connection,
        tokenManagerData?.parsed.transferAuthority
      );
      return true;
    } catch (error) {
      console.error(error);
      console.log("Invalid transfer authority");
    }
  }
  return false;
};
