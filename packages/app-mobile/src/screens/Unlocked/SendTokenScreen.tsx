import type { Nft } from "@coral-xyz/common";
import type { StackScreenProps } from "@react-navigation/stack";

import { useCallback, useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Text,
} from "react-native";

import { Token } from "@@types/types";
import {
  Blockchain,
  ETH_NATIVE_MINT,
  SOL_NATIVE_MINT,
  walletAddressDisplay,
  toDisplayBalance,
  NATIVE_ACCOUNT_RENT_EXEMPTION_LAMPORTS,
  isMadLads,
} from "@coral-xyz/common";
import {
  useAnchorContext,
  useEthereumCtx,
  useIsValidAddress,
} from "@coral-xyz/recoil";
import {
  SecondaryButton,
  PrimaryButton,
  DangerButton,
  Box,
  XStack,
  YStack,
} from "@coral-xyz/tamagui";
import { BigNumber } from "ethers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SendEthereumConfirmationCard } from "~components/BottomDrawerEthereumConfirmation";
import {
  SendSolanaConfirmationCard,
  ConfirmSendSolanaTable,
} from "~components/BottomDrawerSolanaConfirmation";
import {
  Header,
  BetterBottomSheet,
  BottomSheetModal,
} from "~components/BottomSheetModal";
import { UnstyledTokenTextInput } from "~components/TokenInputField";
import { UserAvatar } from "~components/UserAvatar";
import { StyledText, Screen, TwoButtonFooter } from "~components/index";
import { useTheme as useCustomTheme } from "~hooks/useTheme";
import type { UnlockedNavigatorStackParamList } from "~navigation/UnlockedNavigator";

import { SendTokenSelectUserScreen } from "./SendTokenScreen2";
import { SearchableTokenTables } from "./components/Balances";

export function SendTokenSelectRecipientScreen({
  route,
  navigation,
}: StackScreenProps<
  UnlockedNavigatorStackParamList,
  "SendTokenModal"
>): JSX.Element {
  const [address, setAddress] = useState<string>("");
  const { blockchain, token } = route.params;
  const { provider: solanaProvider } = useAnchorContext();
  const ethereumCtx = useEthereumCtx();

  const {
    isValidAddress,
    _isErrorAddress,
    normalizedAddress: destinationAddress,
  } = useIsValidAddress(
    blockchain,
    address,
    solanaProvider.connection,
    ethereumCtx.provider
  );

  const hasInputError = !isValidAddress && address.length > 15;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Screen style={{ paddingHorizontal: 12, paddingVertical: 16 }}>
        <SendTokenSelectUserScreen
          blockchain={blockchain}
          token={token}
          inputContent={address}
          setInputContent={setAddress}
          hasInputError={hasInputError}
          onSelectUserResult={({ user, address }) => {
            if (!address) {
              return;
            }

            navigation.navigate("SendTokenConfirm", {
              blockchain,
              token,
              to: {
                address,
                username: user.username,
                walletName: user.walletName,
                image: user.image,
                uuid: user.uuid,
              },
            });
          }}
          onPressNext={({ user }) => {
            navigation.navigate("SendTokenConfirm", {
              blockchain,
              token,
              to: {
                address: destinationAddress,
                username: user?.username,
                image: user?.image,
                uuid: user?.uuid,
              },
            });
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

export function SendTokenListScreen({ navigation }): JSX.Element {
  return (
    <Screen>
      <SearchableTokenTables
        onPressRow={(blockchain: Blockchain, token: Token) => {
          navigation.push("SendTokenModal", {
            blockchain,
            token: {
              ...token,
              nativeBalance: token.nativeBalance.toString(),
            },
          });
        }}
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
    </Screen>
  );
}

function CopyablePublicKey({ address }): JSX.Element {
  const theme = useCustomTheme();
  return (
    <Pressable
      style={{}}
      onPress={async () => {
        console.log("copy clipboard");
      }}
    >
      <Text
        style={{
          fontSize: 13,
          padding: 4,
          backgroundColor: theme.custom.colors.bg2,
        }}
      >
        {walletAddressDisplay(address)}
      </Text>
    </Pressable>
  );
}

function AvatarHeader({
  walletName,
  username,
  address,
  image,
}: {
  walletName?: string | undefined;
  username?: string | undefined;
  address?: string | undefined;
  image: string;
}): JSX.Element {
  const theme = useCustomTheme();
  return (
    <YStack ai="center">
      <UserAvatar size={80} uri={image} />
      {walletName || username ? (
        <Text
          style={{
            marginTop: 8,
            color: theme.custom.colors.fontColor,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          {walletName ? walletName : `@${username}`}
        </Text>
      ) : null}
      <Box mt={8}>
        <CopyablePublicKey address={address} />
      </Box>
    </YStack>
  );
}

function TokenLabel({
  logo,
  ticker,
}: {
  logo: string;
  ticker: string;
}): JSX.Element {
  const theme = useCustomTheme();
  return (
    <XStack ai="center" jc="center" mt={8}>
      <Image
        source={{ uri: logo }}
        style={{
          height: 36,
          width: 36,
          aspectRatio: 1,
          borderRadius: 18,
          marginRight: 6,
        }}
      />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "600",
          color: theme.custom.colors.smallTextColor,
        }}
      >
        {ticker}
      </Text>
    </XStack>
  );
}

function MaxAmountLabel({
  token,
  amount,
  onSetAmount,
}: {
  token: Token;
  amount: BigNumber | null;
  onSetAmount: (amount: BigNumber) => void;
}): JSX.Element {
  const theme = useCustomTheme();
  return (
    <View style={{ alignItems: "center" }}>
      <Pressable
        onPress={() => amount && onSetAmount(amount)}
        style={{
          borderRadius: 8,
          backgroundColor: theme.custom.colors.bg3,
          paddingHorizontal: 12,
          paddingVertical: 4,
          // @ts-ignore
          cursor: "pointer",
          borderColor: theme.custom.colors.borderFull,
        }}
      >
        <Text
          style={{
            color: theme.custom.colors.fontColor,
            fontSize: 14,
          }}
        >
          Max: {amount ? toDisplayBalance(amount, token.decimals) : "0.0"}{" "}
          {token.ticker}
        </Text>
      </Pressable>
    </View>
  );
}

export function SendTokenConfirmScreen({
  navigation,
  route,
}: StackScreenProps<
  UnlockedNavigatorStackParamList,
  "SendTokenConfirm"
>): JSX.Element {
  const theme = useCustomTheme();
  const insets = useSafeAreaInsets();
  const { blockchain, token, to } = route.params;
  const { address, walletName, image, username } = to;
  const ethereumCtx = useEthereumCtx();

  const [modalIndex, setModalIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feeOffset, setFeeOffset] = useState<BigNumber>(BigNumber.from(0));
  const [amount, setAmount] = useState<BigNumber | null>(null);

  useEffect(() => {
    if (!token || !ethereumCtx?.feeData) {
      return;
    }
    if (token.mint === SOL_NATIVE_MINT) {
      // When sending SOL, account for the tx fee and rent exempt minimum.
      setFeeOffset(
        BigNumber.from(5000).add(
          BigNumber.from(NATIVE_ACCOUNT_RENT_EXEMPTION_LAMPORTS)
        )
      );
    } else if (token.address === ETH_NATIVE_MINT) {
      // 21,000 GWEI for a standard ETH transfer
      setFeeOffset(
        BigNumber.from("21000")
          .mul(ethereumCtx?.feeData.maxFeePerGas!)
          .add(
            BigNumber.from("21000").mul(
              ethereumCtx?.feeData.maxPriorityFeePerGas!
            )
          )
      );
    }
  }, [blockchain, token]); // eslint-disable-line

  const amountSubFee = BigNumber.from(token.nativeBalance).sub(feeOffset);
  const maxAmount = amountSubFee.gt(0) ? amountSubFee : BigNumber.from(0);
  const exceedsBalance = amount && amount.gt(maxAmount);
  const isSendDisabled = amount === null || !!exceedsBalance;
  const isAmountError = Boolean(amount && exceedsBalance);

  const getButton = useCallback(
    (isSendDisabled: boolean, isAmountError: boolean): JSX.Element => {
      const handleShowPreviewConfirmation = () => {
        setIsModalVisible(() => true);
        Keyboard.dismiss();
      };

      if (isAmountError) {
        return (
          <DangerButton
            disabled
            label="Insufficient Balance"
            onPress={() => {}}
          />
        );
      } else {
        return (
          <PrimaryButton
            disabled={isSendDisabled}
            label="Review"
            onPress={handleShowPreviewConfirmation}
          />
        );
      }
    },
    []
  );

  const SendConfirmComponent = {
    [Blockchain.SOLANA]: SendSolanaConfirmationCard,
    [Blockchain.ETHEREUM]: SendEthereumConfirmationCard,
  }[blockchain];

  return (
    <>
      <Screen
        style={{ justifyContent: "space-between", marginBottom: insets.bottom }}
      >
        <YStack mt={24} f={1}>
          <Box mb={18}>
            <AvatarHeader
              walletName={walletName}
              address={address}
              username={username}
              image={image}
            />
          </Box>
          <UnstyledTokenTextInput
            decimals={token.decimals}
            amount={amount}
            onChangeAmount={setAmount}
            style={{
              fontSize: 48,
              height: 48,
              fontWeight: "600",
              color: theme.custom.colors.fontColor,
              textAlign: "center",
              width: "100%",
            }}
          />
          <Box mb={12}>
            <TokenLabel logo={token.logo} ticker={token.ticker} />
          </Box>
          <MaxAmountLabel
            amount={maxAmount}
            token={token}
            onSetAmount={setAmount}
          />
        </YStack>
        {getButton(isSendDisabled, isAmountError)}
      </Screen>
      <BottomSheetModal
        snapPoints={[500, 420]}
        isVisible={isModalVisible}
        index={modalIndex}
        resetVisibility={() => {
          setIsModalVisible(() => false);
        }}
      >
        <SendConfirmComponent
          navigation={navigation}
          token={token}
          destinationAddress={address}
          amount={amount!}
          onCompleteStep={(step: string) => {
            if (step !== "confirm") {
              setModalIndex(() => 1);
            }
          }}
        />
      </BottomSheetModal>
    </>
  );
}

export function SendNFTConfirmScreen({ route, navigation }): JSX.Element {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { nft, to } = route.params;

  // const SendConfirmComponent = {
  //   [Blockchain.SOLANA]: SendSolanaConfirmationCard,
  //   [Blockchain.ETHEREUM]: SendEthereumConfirmationCard,
  // }[nft.blockchain];

  return (
    <>
      <Screen
        style={{ justifyContent: "space-between", marginBottom: insets.bottom }}
      >
        <YStack ai="center" mt={24}>
          <Box mb={24}>
            <AvatarHeader
              walletName={to.walletName}
              address={to.address}
              username={to.username}
              image={to.image}
            />
          </Box>
          <NFTPreviewImage nft={nft} width={192} height={192} />
        </YStack>
        <TwoButtonFooter
          leftButton={
            <SecondaryButton
              label="Cancel"
              onPress={() => {
                navigation.goBack();
              }}
            />
          }
          rightButton={
            <PrimaryButton
              label="Next"
              onPress={async () => {
                setIsModalVisible(() => true);
              }}
            />
          }
        />
      </Screen>
      <BetterBottomSheet
        isVisible={isModalVisible}
        resetVisibility={() => setIsModalVisible(false)}
      >
        <YStack ai="center" mb={18}>
          <Header text="Review Send" />
          <XStack space ai="center" my={18}>
            <NFTPreviewImage nft={nft} width={48} height={48} />
            <StyledText fontWeight="700" fontSize={24}>
              1
            </StyledText>
          </XStack>
          <ConfirmSendSolanaTable destinationAddress={to.address} />
        </YStack>
        <PrimaryButton label="Send" onPress={() => {}} />
      </BetterBottomSheet>
    </>
  );
}

function NFTPreviewImage({
  nft,
  width,
  height,
}: {
  nft: Nft;
  width: number;
  height: number;
}): JSX.Element {
  const uri = isMadLads(nft.creators) ? nft.lockScreenImageUrl : nft.imageUrl;
  return (
    <Image
      source={{ uri }}
      style={{
        borderRadius: 8,
        width,
        height,
      }}
    />
  );
}
