import { useEffect, useState } from "react";
import type { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { useCustomTheme } from "@coral-xyz/themes";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import {
  Checkbox,
  Header,
  SubtextParagraph,
  PrimaryButton,
  walletAddressDisplay,
} from "./common";
import { DerivationPath } from "@coral-xyz/common";

type Account = {
  publicKey: anchor.web3.PublicKey;
  account?: anchor.web3.AccountInfo<Buffer>;
};

export function ImportAccounts({
  loadAccounts,
  onNext,
}: {
  loadAccounts: (derivationPath: DerivationPath) => Promise<Array<Account>>;
  onNext: (accountIndices: number[]) => void;
}) {
  const theme = useCustomTheme();
  const [accounts, setAccounts] = useState<Array<Account>>([]);
  const [accountIndices, setAccountIndices] = useState<number[]>([]);
  const [derivationPath, setDerivationPath] = useState<DerivationPath>(
    DerivationPath.Bip44Change
  );

  useEffect(() => {
    loadAccounts(derivationPath).then(setAccounts);
  }, [derivationPath]);

  const handleSelect = (index: number) => () => {
    const currentIndex = accountIndices.indexOf(index);
    const newAccountIndices = [...accountIndices];
    if (currentIndex === -1) {
      newAccountIndices.push(index);
    } else {
      newAccountIndices.splice(currentIndex, 1);
    }
    newAccountIndices.sort();
    setAccountIndices(newAccountIndices);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            marginLeft: "24px",
            marginRight: "24px",
            marginTop: "24px",
          }}
        >
          <Header text="Import Accounts" />
          <SubtextParagraph style={{ marginTop: "8px" }}>
            Select which accounts you'd like to import.
          </SubtextParagraph>
        </Box>
        <List
          sx={{
            color: theme.custom.colors.fontColor,
            background: theme.custom.colors.background,
            borderRadius: "12px",
            marginLeft: "16px",
            marginRight: "16px",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          {accounts.map(({ publicKey, account }, index) => (
            <ListItemButton
              key={publicKey.toString()}
              onClick={handleSelect(index)}
              sx={{
                display: "flex",
                paddinLeft: "16px",
                paddingRight: "16px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              <Box style={{ display: "flex", width: "100%" }}>
                <Checkbox
                  edge="start"
                  checked={accountIndices.indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                  style={{ marginLeft: 0 }}
                />
                <ListItemText
                  id={publicKey.toString()}
                  primary={walletAddressDisplay(publicKey)}
                  sx={{
                    marginLeft: "8px",
                    fontSize: "14px",
                    lineHeight: "32px",
                    fontWeight: 500,
                  }}
                />
                <ListItemText
                  sx={{
                    color: theme.custom.colors.secondary,
                    textAlign: "right",
                  }}
                  primary="0 SOL"
                />
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          mt: "12px",
          ml: "16px",
          mr: "16px",
          mb: "16px",
        }}
      >
        <PrimaryButton
          label="Import Accounts"
          onClick={() => onNext(accountIndices)}
          disabled={accountIndices.length === 0}
        />
      </Box>
    </Box>
  );
}
