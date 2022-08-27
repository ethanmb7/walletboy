import { useState, useEffect } from "react";
import { CircularProgress, Typography, Button, Link } from "@mui/material";
import {
  getLogger,
  confirmTransaction,
  explorerUrl,
  Solana,
} from "@coral-xyz/common";
import { useCustomTheme } from "@coral-xyz/themes";
import {
  useSolanaCtx,
  useSolanaExplorer,
  useSolanaConnectionUrl,
  useNavigation,
} from "@coral-xyz/recoil";
import { useNavStack } from "../../../common/Layout/NavStack";
import { PrimaryButton, SecondaryButton, LaunchDetail } from "../../../common";
import { ApproveTransactionDrawer } from "../../../common/ApproveTransactionDrawer";
import { CheckIcon } from "../../../common/Icon";
import { useDrawerContext } from "../../../common/Layout/Drawer";

const logger = getLogger("xnft-detail");

export const XnftDetail: React.FC<{ xnft: any }> = ({ xnft }) => {
  const theme = useCustomTheme();
  const [openConfirm, setOpenConfirm] = useState(false);
  const nav = useNavStack();

  useEffect(() => {
    nav.setTitle(xnft.title);
  }, []);

  return (
    <div
      style={{
        padding: "16px",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <div>
        <img
          src={xnft.iconUrl}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "8px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "30px",
          }}
        />
        <Button
          disableRipple
          variant="contained"
          style={{
            textTransform: "none",
            background: theme.custom.colors.bg2,
            color: theme.custom.colors.fontColor,
            borderRadius: "12px",
            marginLeft: "auto",
            marginRight: "auto",
            height: "48px",
            display: "flex",
            position: "relative",
          }}
          onClick={() =>
            window.open(
              `https://xnft.gg/app/${xnft.install.account.xnft.toString()}`
            )
          }
        >
          View in Library{" "}
          <LaunchDetail
            style={{
              marginLeft: "4px",
              marginRight: "-4px",
            }}
          />
        </Button>
      </div>
      <div>
        <PrimaryButton
          label={"Uninstall xNFT"}
          style={{
            backgroundColor: theme.custom.colors.negative,
          }}
          onClick={() => setOpenConfirm(true)}
        />
      </div>
      <ApproveTransactionDrawer
        openDrawer={openConfirm}
        setOpenDrawer={setOpenConfirm}
      >
        <UninstallConfirmationCard xnft={xnft} />
      </ApproveTransactionDrawer>
    </div>
  );
};

const UninstallConfirmationCard = ({ xnft }: { xnft: any }) => {
  const ctx = useSolanaCtx();
  const [cardType, setCardType] = useState<
    "confirm" | "sending" | "complete" | "error"
  >("confirm");
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const onConfirm = async () => {
    //
    // Change view to display loading indicator.
    //
    setCardType("sending");

    //
    // Send the tx.
    //
    let txSig = "";
    try {
      txSig = await Solana.uninstallXnft(ctx);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (err) {
      logger.error("unable to send transaction", err);
      setCardType("error");
      return;
    }
    setTxSignature(txSig);

    //
    // Confirm tx.
    //
    try {
      await confirmTransaction(
        ctx.connection,
        txSig,
        ctx.commitment !== "confirmed" && ctx.commitment !== "finalized"
          ? "confirmed"
          : ctx.commitment
      );
    } catch (err) {
      logger.error("unable to confirm", err);
      setCardType("error");
    }
  };
  return cardType === "confirm" ? (
    <ConfirmUninstall xnft={xnft} onConfirm={onConfirm} />
  ) : cardType === "sending" ? (
    <Sending signature={txSignature!} isComplete={false} />
  ) : cardType === "complete" ? (
    <Sending signature={txSignature!} isComplete={true} />
  ) : (
    <Error signature={txSignature!} />
  );
};

const ConfirmUninstall = ({
  xnft,
  onConfirm,
}: {
  xnft: any;
  onConfirm: () => void;
}) => {
  const theme = useCustomTheme();
  return (
    <div
      style={{
        height: "402px",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          style={{
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          Are you sure you want to uninstall {xnft.title}?
        </Typography>
      </div>
      <PrimaryButton
        label={"Confirm"}
        style={{
          backgroundColor: theme.custom.colors.negative,
        }}
        onClick={() => onConfirm()}
      />
    </div>
  );
};

function Error({ signature }: { signature: string }) {
  const theme = useCustomTheme();
  const explorer = useSolanaExplorer();
  const connectionUrl = useSolanaConnectionUrl();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography
        style={{ textAlign: "center", color: theme.custom.colors.secondary }}
      >
        There was a problem confirming the transaction.
      </Typography>
      <Link
        href={explorerUrl(explorer, signature, connectionUrl)}
        target="_blank"
        style={{ textAlign: "center" }}
      >
        View Transaction
      </Link>
    </div>
  );
}

function Sending({
  signature,
  isComplete,
}: {
  signature: string;
  isComplete: boolean;
}) {
  const theme = useCustomTheme();
  const solanaExplorer = useSolanaExplorer();
  const connectionUrl = useSolanaConnectionUrl();
  const nav = useNavigation();
  const drawer = useDrawerContext();
  return (
    <div
      style={{
        height: "264px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        style={{
          textAlign: "center",
          color: theme.custom.colors.secondary,
          fontSize: "14px",
          fontWeight: 500,
          marginTop: "30px",
        }}
      >
        {isComplete ? "Sent" : "Sending..."}
      </Typography>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {isComplete ? (
          <div style={{ textAlign: "center" }}>
            <CheckIcon />
          </div>
        ) : (
          <CircularProgress
            size={48}
            style={{
              color: theme.custom.colors.primaryButton,
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            thickness={6}
          />
        )}
      </div>
      <div
        style={{
          marginBottom: "16px",
          marginLeft: "16px",
          marginRight: "16px",
        }}
      >
        <SecondaryButton
          onClick={() => {
            if (isComplete) {
              nav.toRoot();
              drawer.close();
            } else {
              window.open(
                explorerUrl(solanaExplorer, signature, connectionUrl)
              );
            }
          }}
          label={isComplete ? "View Balances" : "View Explorer"}
        />
      </div>
    </div>
  );
}
