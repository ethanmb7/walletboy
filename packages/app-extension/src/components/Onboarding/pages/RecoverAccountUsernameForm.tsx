import { useCustomTheme } from "@coral-xyz/themes";
import { AlternateEmail } from "@mui/icons-material";
import { Box, InputAdornment } from "@mui/material";
import { BACKEND_API_URL } from "@coral-xyz/common";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Header, PrimaryButton, SubtextParagraph } from "../../common";
import { getWaitlistId } from "../../common/WaitingRoom";
import { TextInput } from "../../common/Inputs";

export const RecoverAccountUsernameForm = ({
  onNext,
}: {
  onNext: (username: string, publicKey: string) => void;
}) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const theme = useCustomTheme();

  useEffect(() => {
    setError("");
  }, [username]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(`${BACKEND_API_URL}/users/${username}`, {
          headers: {
            "x-backpack-waitlist-id": getWaitlistId() || "",
          },
        });
        const json = await res.json();
        // Use the first found public key
        onNext(username, json.publicKeys[0].publicKey);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    },
    [username]
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "0 16px 16px",
      }}
    >
      <Box style={{ padding: 8, flex: 1 }}>
        <Header text="Username recovery" />
        <SubtextParagraph style={{ margin: "16px 0" }}>
          Enter your username below, you will then be asked for your secret
          recovery phrase to verify that you own the public key that was
          initially associated with it.
        </SubtextParagraph>
      </Box>
      <Box style={{ flex: 1 }}>
        <TextInput
          inputProps={{
            name: "username",
            autoComplete: "off",
            spellCheck: "false",
            autoFocus: true,
          }}
          placeholder="Username"
          type="text"
          value={username}
          setValue={(e: any) => {
            setUsername(
              e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
            );
          }}
          error={error ? true : false}
          errorMessage={error}
          startAdornment={
            <InputAdornment position="start">
              <AlternateEmail
                style={{
                  color: theme.custom.colors.secondary,
                  fontSize: 18,
                  marginRight: -2,
                  userSelect: "none",
                }}
              />
            </InputAdornment>
          }
        />
      </Box>
      <Box>
        <PrimaryButton
          label="Continue"
          type="submit"
          style={{ marginTop: 8 }}
        />
      </Box>
    </form>
  );
};
