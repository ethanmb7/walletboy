import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styles } from "@coral-xyz/themes";
import {
  getLogger,
  EXTENSION_WIDTH,
  EXTENSION_HEIGHT,
  openOnboarding,
  QUERY_LOCKED,
  QUERY_APPROVAL,
  QUERY_LOCKED_APPROVAL,
  QUERY_APPROVE_TRANSACTION,
  QUERY_APPROVE_MESSAGE,
} from "@coral-xyz/common";
import {
  KeyringStoreStateEnum,
  useKeyringStoreState,
  useApprovedOrigins,
  useBootstrapFast,
  useBackgroundResponder,
} from "@coral-xyz/recoil";
import { Locked } from "../components/Locked";
import { Unlocked } from "../components/Unlocked";
import { ApproveTransaction, ApproveMessage } from "../components/Approval";
import { ApproveOrigin } from "../components/Unlocked/Approvals/ApproveOrigin";
import "./App.css";

const logger = getLogger("router");

export function Router() {
  return (
    <WithSuspense>
      <_Router />
    </WithSuspense>
  );
}

function _Router() {
  const classes = useStyles();

  //
  // Expanded view: first time onboarding flow.
  //
  const needsOnboarding =
    useKeyringStoreState() === KeyringStoreStateEnum.NeedsOnboarding;

  if (needsOnboarding) {
    openOnboarding();
    return <></>;
  }

  //
  // Popup view: main application.
  //
  return (
    <div className={classes.appContainer}>
      <PopupRouter />
    </div>
  );
}

//
// Router for components that display in the extension popup--distinct from
// the expanded full app view.
//
// Query paramaters determines the app flow. There are four cases.
//
// 1) There is no query parameter. In this case, the extension is being
//    opened from the browser toolbar. This is the normal path and we simply
//    show the normal app.
// 2) There is a "locked" query parameter. This means an app is trying to
//    connect, and has been previously been approved. But the wallet is locked
//    so we provide the ability to unlock and nothing more.
// 3) There is a "approval" parameter. This means the app is trying to
//    connect, and the wallet is unlocked. But has not been previously approved.
//    So we provide the ability to approve the app and nothing more.
// 4) There is a "locked-approval" query parameter. This combines 2) and 3).
//    First we provide the ability to unlock the wallet, and then approve.
//
function PopupRouter() {
  logger.debug("app router search", window.location.search);

  //
  // Extract the url query parameters for routing dispatch.
  //
  const search =
    window.location.search.length > 0
      ? window.location.search.substring(1)
      : "";
  const query = search.split("&")[0];

  // Render the app flows described above.
  switch (query) {
    case QUERY_LOCKED:
      return <QueryLocked />;
    case QUERY_APPROVAL:
      return <QueryApproval />;
    case QUERY_LOCKED_APPROVAL:
      return <QueryLockedApproval />;
    case QUERY_APPROVE_TRANSACTION:
      return <QueryApproveTransaction />;
    case QUERY_APPROVE_MESSAGE:
      return <QueryApproveMessage />;
    default:
      return <FullApp />;
  }
}

function QueryLockedApproval() {
  logger.debug("query locked approval");
  const keyringStoreState = useKeyringStoreState();
  const isLocked = keyringStoreState === KeyringStoreStateEnum.Locked;
  return isLocked ? <LockedBootstrap /> : <QueryApproval />;
}

function QueryLocked() {
  logger.debug("query locked");
  const background = useBackgroundResponder();

  const url = new URL(window.location.href);
  const requestId = parseInt(url.searchParams.get("requestId")!);

  const keyringStoreState = useKeyringStoreState();
  const isLocked = keyringStoreState === KeyringStoreStateEnum.Locked;

  // Wallet is unlocked so close the window. We're done.
  if (!isLocked) {
    return <></>;
  }
  return (
    <LockedBootstrap
      onUnlock={async () => {
        await background.response({
          id: requestId,
          result: true,
        });
        window.close();
      }}
    />
  );
}

function QueryApproval() {
  logger.debug("query approval");
  const background = useBackgroundResponder();
  const url = new URL(window.location.href);
  const origin = url.searchParams.get("origin");
  const title = url.searchParams.get("title");
  const requestId = parseInt(url.searchParams.get("requestId")!);

  const approvedOrigins = useApprovedOrigins();
  const found = approvedOrigins.find((ao) => ao === origin);

  // Origin is found so close the window. We're done.
  if (found) {
    return <></>;
  }
  return (
    <ApproveOrigin
      origin={origin}
      title={title}
      onCompletion={async (didApprove: boolean) => {
        await background.response({
          id: requestId,
          result: didApprove,
        });
        window.close();
      }}
    />
  );
}

function QueryApproveTransaction() {
  logger.debug("query approve transaction");

  const background = useBackgroundResponder();
  const url = new URL(window.location.href);
  const origin = url.searchParams.get("origin");
  const requestId = parseInt(url.searchParams.get("requestId")!);
  const tx = url.searchParams.get("tx");

  return (
    <ApproveTransaction
      tx={tx}
      origin={origin}
      onCompletion={async (didApprove: boolean) => {
        await background.response({
          id: requestId,
          result: didApprove,
        });
        window.close();
      }}
    />
  );
}

function QueryApproveMessage() {
  logger.debug("query approve message");

  const bg = useBackgroundResponder();
  const url = new URL(window.location.href);
  const origin = url.searchParams.get("origin");
  const requestId = parseInt(url.searchParams.get("requestId")!);
  const message = url.searchParams.get("message");

  return (
    <ApproveMessage
      message={message}
      origin={origin}
      onCompletion={async (didApprove: boolean) => {
        await bg.response({
          id: requestId,
          result: didApprove,
        });
        window.close();
      }}
    />
  );
}

function FullApp() {
  logger.debug("full app");

  const keyringStoreState = useKeyringStoreState();
  const needsOnboarding =
    keyringStoreState === KeyringStoreStateEnum.NeedsOnboarding;
  const isLocked =
    !needsOnboarding && keyringStoreState === KeyringStoreStateEnum.Locked;

  console.log("rendering is locked", isLocked);

  return (
    <AnimatePresence initial={false}>
      <WithLockMotion key={isLocked ? "locked" : "unlocked"}>
        {isLocked && <LockedBootstrap />}
        {!isLocked && <Unlocked />}
      </WithLockMotion>
    </AnimatePresence>
  );
}

function WithLockMotion({ children, key }: any) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
      key={key}
      variants={MOTION_VARIANTS}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
    >
      {children}
    </motion.div>
  );
}

function LockedBootstrap({ onUnlock }: any) {
  useBootstrapFast();
  return <Locked onUnlock={onUnlock} />;
}

export function WithSuspense(props: any) {
  return <Suspense fallback={<BlankApp />}>{props.children}</Suspense>;
}

export function BlankApp() {
  const classes = useStyles();
  return <div className={classes.appContainer}></div>;
}

const useStyles = styles((theme) => {
  return {
    appContainer: {
      width: `${EXTENSION_WIDTH}px`,
      height: `${EXTENSION_HEIGHT}px`,
      backgroundColor: theme.custom.colors.background,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    },
  };
});

const MOTION_VARIANTS = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { delay: 0.09 },
  },
  exit: {
    transition: { delay: 0.09, duration: 0.1 },
    opacity: 0,
  },
};
