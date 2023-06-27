import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, View, Text } from "react-native";

import {
  UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
  UI_RPC_METHOD_KEYRING_VALIDATE_MNEMONIC,
} from "@coral-xyz/common";
import { useBackgroundClient } from "@coral-xyz/recoil";
import { StyledText, YStack } from "@coral-xyz/tamagui";

import { maybeRender } from "~lib/index";

import { MnemonicInputFields } from "~src/components/MnemonicInputFields";
import { CopyButton, PasteButton } from "~src/components/index";

type MnemonicInputProps = {
  readOnly: boolean;
  onComplete: ({
    mnemonic,
    isValid,
  }: {
    mnemonic: string;
    isValid: boolean;
  }) => void;
};
export function MnemonicInput({ readOnly, onComplete }: MnemonicInputProps) {
  const background = useBackgroundClient();

  const [mnemonicWords, setMnemonicWords] = useState<string[]>([
    ...Array(12).fill(""),
  ]);

  const mnemonic = mnemonicWords.map((f) => f.trim()).join(" ");

  const generateRandom = useCallback(() => {
    background
      .request({
        method: UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
        params: [mnemonicWords.length === 12 ? 128 : 256],
      })
      .then((m: string) => {
        const words = m.split(" ");
        setMnemonicWords(words);
      });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (readOnly) {
      generateRandom();
    }
  }, [readOnly, generateRandom]);

  const isValidAsync = (mnemonic: string) => {
    return background.request({
      method: UI_RPC_METHOD_KEYRING_VALIDATE_MNEMONIC,
      params: [mnemonic],
    });
  };

  const onChange = async (words: string[]) => {
    setMnemonicWords(words);
    const mnemonic = mnemonicWords.map((f) => f.trim()).join(" ");
    const isValid = await isValidAsync(mnemonic);
    onComplete({ isValid, mnemonic });
  };

  return (
    <YStack space={8}>
      <MnemonicInputFields
        mnemonicWords={mnemonicWords}
        onChange={readOnly ? undefined : onChange}
        onComplete={async () => {
          const isValid = await isValidAsync(mnemonic);
          onComplete({ isValid, mnemonic });
        }}
      />
      {readOnly ? (
        <CopyButton text={mnemonicWords.join(", ")} />
      ) : (
        <PasteButton
          onPaste={(words) => {
            const split = words.split(" ");
            if ([12, 24].includes(split.length)) {
              setMnemonicWords(words.split(" "));
            } else {
              Alert.alert("Mnemonic should be either 12 or 24 words");
            }
          }}
        />
      )}
      {maybeRender(!readOnly, () => (
        <Pressable
          hitSlop={12}
          onPress={() => {
            setMnemonicWords([
              ...Array(mnemonicWords.length === 12 ? 24 : 12).fill(""),
            ]);
          }}
        >
          <StyledText fontSize="$sm" textAlign="center">
            Use a {mnemonicWords.length === 12 ? "24" : "12"}-word recovery
            mnemonic
          </StyledText>
        </Pressable>
      ))}
    </YStack>
  );
}
