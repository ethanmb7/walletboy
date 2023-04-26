import type { Token, NavTokenOptions } from "@@types/types";
import type { Blockchain } from "@coral-xyz/common";

import { useCallback } from "react";
import { FlatList } from "react-native";

import { Box } from "@coral-xyz/tamagui";
import { useIsFocused } from "@react-navigation/native";

import { TransferWidget } from "~components/Unlocked/Balances/TransferWidget";
import { Screen, RoundedContainerGroup } from "~components/index";
import { useBlockchainBalancesSorted, useActiveWallet } from "~hooks/recoil";
import { BalanceSummaryWidget } from "~screens/Unlocked/components/BalanceSummaryWidget";
import { TokenRow } from "~screens/Unlocked/components/Balances";

export function WalletOverviewScreen({ navigation }) {
  const isFocused = useIsFocused();
  if (isFocused) {
    return <_WalletOverviewScreen navigation={navigation} />;
  }
  return null;
}

function _WalletOverviewScreen({ navigation }) {
  const { data: wallet } = useActiveWallet();
  const { data: balances } = useBlockchainBalancesSorted({
    publicKey: wallet.publicKey.toString(),
    blockchain: wallet.blockchain,
  });

  const onPressToken = useCallback(
    (blockchain: Blockchain, token: Token) => {
      navigation.push("TokenDetail", {
        blockchain,
        tokenAddress: token.address,
        tokenTicker: token.ticker,
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item: token, index }) => {
      const isFirst = index === 0;
      const isLast = index === balances.length - 1;

      return (
        <RoundedContainerGroup
          disableTopRadius={!isFirst}
          disableBottomRadius={!isLast}
        >
          <TokenRow
            onPressRow={onPressToken}
            blockchain={wallet.blockchain}
            token={token}
            walletPublicKey={wallet.publicKey.toString()}
          />
        </RoundedContainerGroup>
      );
    },
    [balances.length, onPressToken, wallet.blockchain, wallet.publicKey]
  );

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={balances}
        keyExtractor={(item) => item.address}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <BalanceSummaryWidget />
            <Box marginVertical={12}>
              <TransferWidget
                swapEnabled={false}
                rampEnabled={false}
                onPressOption={(route: string, options: NavTokenOptions) => {
                  navigation.push(route, options);
                }}
              />
            </Box>
          </>
        }
      />
    </Screen>
  );
}