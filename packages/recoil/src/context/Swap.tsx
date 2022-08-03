import * as bs58 from "bs58";
import BN from "bn.js";
import React, { useContext, useEffect, useState, useRef } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  associatedTokenAddress,
  confirmTransaction,
  generateWrapSolTx,
  generateUnwrapSolTx,
  SOL_NATIVE_MINT,
  USDC_MINT,
  WSOL_MINT,
  UI_RPC_METHOD_SIGN_AND_SEND_TRANSACTION,
} from "@coral-xyz/common";
import {
  useActiveWallet,
  useBackgroundClient,
  useSplTokenRegistry,
  useSolanaCtx,
} from "../hooks";
import { JUPITER_BASE_URL } from "../atoms/solana/jupiter";

const DEFAULT_SLIPPAGE_PERCENT = 1;
// Poll for new routes every 30 seconds in case of changing market conditions
const ROUTE_POLL_INTERVAL = 30000;

type JupiterRoute = {
  amount: number;
  inAmount: number;
  otherAmountThreshold: number;
  outAmount: number;
  outAmountWithSlippage: number;
  priceImpactPct: number;
  swapMode: string;
};

type JupiterTransactions = {
  wrapTransaction?: string;
  setupTransaction?: string;
  swapTransaction: string;
  cleanupTransaction?: string;
};

type SwapContext = {
  fromAmount: number | null;
  setFromAmount: (a: number) => void;
  toAmount: number | null;
  fromMint: string;
  setFromMint: (mint: string) => void;
  toMint: string;
  setToMint: (mint: string) => void;
  swapToFromMints: any;
  fromToken: string;
  fromMintInfo: any;
  toToken: string;
  toMintInfo: any;
  slippage: number;
  setSlippage: (s: number) => void;
  executeSwap: () => Promise<any>;
  priceImpactPct: number;
  transactions: any;
  transactionFee: any;
  isLoadingRoutes: boolean;
  isLoadingTransactions: boolean;
  isLoadingTransactionFee: boolean;
  isJupiterError: boolean;
};

const _SwapContext = React.createContext<SwapContext | null>(null);

export function SwapProvider(props: any) {
  const wallet = useActiveWallet();
  const tokenRegistry = useSplTokenRegistry();
  const solanaCtx = useSolanaCtx();
  const { connection } = solanaCtx;
  const background = useBackgroundClient();

  // Swap setttings
  const [[fromMint, toMint], setFromMintToMint] = useState([
    SOL_NATIVE_MINT,
    USDC_MINT,
  ]);
  const [fromAmount, setFromAmount] = useState<number | null>(null);
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE_PERCENT);

  // Jupiter data
  const [routes, setRoutes] = useState<JupiterRoute[]>([]);

  const [transactions, setTransactions] = useState<JupiterTransactions | null>(
    null
  );
  const [transactionFee, setTransactionFee] = useState<number | null>(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingTransactionFee, setIsLoadingTransactionFee] = useState(false);

  // Error states
  const [isJupiterError, setIsJupiterError] = useState(false);

  const fromToken = associatedTokenAddress(
    new PublicKey(fromMint),
    wallet.publicKey
  );
  const toToken = associatedTokenAddress(
    new PublicKey(toMint),
    wallet.publicKey
  );
  const fromMintInfo = tokenRegistry.get(fromMint)!;
  const toMintInfo = tokenRegistry.get(toMint)!;

  // Whether a wrap transaction is required to execute swap
  const needsWrap = fromMint === SOL_NATIVE_MINT;
  // Whether a unwrap transaction is required to exectue swap
  const needsUnwrap = toMint === SOL_NATIVE_MINT;
  // Boolean representing whether the swap is just a SOL wrap or unwrap and not a real swap
  const isWrap = fromMint === SOL_NATIVE_MINT && toMint === WSOL_MINT;
  const isUnwrap = fromMint === WSOL_MINT && toMint === SOL_NATIVE_MINT;
  // Is a real Jupiter swap instead of just a SOL wrap/unwrap
  const isJupiterSwap = !isWrap && !isUnwrap;

  const route = routes && routes[0];
  // If not a swap, then to amount and from amount are the same
  const toAmount = isJupiterSwap
    ? route && route.outAmount / 10 ** toMintInfo.decimals
    : fromAmount;

  // If wrapping/unwrapping then no price impact
  const priceImpactPct = isJupiterSwap ? route && route.priceImpactPct : 0;

  //
  // On changes to the swap parameters, fetch the swap routes from Jupiter.
  //
  const pollIdRef: { current: NodeJS.Timeout | null } = useRef(null);

  const stopRoutePolling = () => {
    if (pollIdRef.current) {
      clearInterval(pollIdRef.current);
    }
  };

  useEffect(() => {
    const loadRoutes = async () => {
      if (fromAmount && fromAmount > 0 && isJupiterSwap) {
        setRoutes(await fetchRoutes());
        // Success, clear existing polling and setup next
        stopRoutePolling();
        const pollId = setTimeout(loadRoutes, ROUTE_POLL_INTERVAL);
        pollIdRef.current = pollId;
      } else {
        setRoutes([]);
      }
    };
    loadRoutes();
    // Cleanup
    return stopRoutePolling;
  }, [fromMint, fromAmount, toMint, isJupiterSwap]);

  //
  // On changes to the swap routes, fetch the transactions required to execute.
  //
  useEffect(() => {
    (async () => {
      if (routes && routes.length > 0 && !isLoadingRoutes) {
        setTransactions(await fetchTransactions());
      } else {
        setTransactions(null);
      }
    })();
  }, [routes, isLoadingRoutes, isJupiterSwap]);

  //
  // On changes to the swap transactions, recalculate the network fees.
  //
  useEffect(() => {
    (async () => {
      setTransactionFee(null);
      if (transactions && Object.keys(transactions).length > 0) {
        setIsLoadingTransactionFee(true);
        setTransactionFee(await calculateTransactionFee());
        setIsLoadingTransactionFee(false);
      }
    })();
  }, [transactions]);

  //
  // Fetch the Jupiter routes that can be used to execute the swap.
  //
  const fetchRoutes = async () => {
    setRoutes([]);
    setIsLoadingRoutes(true);
    const params = {
      // If the swap is to or from native SOL we want Jupiter to return wSOL
      // routes because it does not support native SOL routes.
      inputMint: fromMint === SOL_NATIVE_MINT ? WSOL_MINT : fromMint,
      outputMint: toMint === SOL_NATIVE_MINT ? WSOL_MINT : toMint,
      amount: (fromAmount! * 10 ** fromMintInfo.decimals).toString(),
      slippage: slippage.toString(),
    };
    const queryString = new URLSearchParams(params).toString();
    try {
      const response = await fetch(`${JUPITER_BASE_URL}quote?${queryString}`);
      if (!response.ok) {
        // fetch throws for network errors but http status code errors so throw
        // manually if status code is outside of 200-299 range
        throw new Error(response.status.toString());
      }
      const { data } = await response.json();
      setIsJupiterError(false);
      return data;
    } catch (e) {
      console.error("error fetching swap routes", e);
      setIsJupiterError(true);
      return [];
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  //
  // Load the transactions required to execute the swap.
  //
  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    let wrapTransaction: string | undefined = undefined;
    if (needsWrap) {
      wrapTransaction = (
        await generateWrapSolTx(
          solanaCtx,
          wallet.publicKey,
          fromAmount! * 10 ** 9
        )
      ).toString("base64");
      if (isWrap) {
        // Just a wrap, no need to fetch Jupiter transactions
        return {
          wrapTransaction,
        };
      }
    }
    const jupiterTransactions = await (
      await fetch(`${JUPITER_BASE_URL}swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route,
          wrapUnwrapSOL: false,
          userPublicKey: wallet.publicKey,
        }),
      })
    ).json();
    setIsLoadingTransactions(false);
    // We cannot generate the unwrap transaction here because the unwrap amount
    // is dependent on the result of the swap
    return {
      ...(wrapTransaction && { wrapTransaction }),
      ...jupiterTransactions,
    };
  };

  //
  // Estimate the network fees the transactions will incur.
  //
  const calculateTransactionFee = async () => {
    let fee = 0;
    if (!transactions) return null;
    for (const serializedTransaction of Object.values(transactions)) {
      const transaction = Transaction.from(
        Buffer.from(serializedTransaction, "base64")
      );
      // Under the hood this just calls connection.getFeeForMessage with
      // the message, it's a convenience method
      try {
        fee += await transaction.getEstimatedFee(connection);
      } catch (e) {
        // TODO errors here for connection unavailable intermittently, why?
        console.log("could not retrieve transaction fee", e);
        return null;
      }
    }
    // Unwrap transaciton not included above, should be fixed cost
    if (needsUnwrap) fee += 5000;
    return fee;
  };

  //
  // Switch the trade direction.
  //
  const swapToFromMints = () => {
    setFromMintToMint([toMint, fromMint]);
    setFromAmount(toAmount ?? 0);
  };

  const setFromMint = (mint: string) => {
    setFromMintToMint([mint, toMint]);
  };

  const setToMint = (mint: string) => {
    setFromMintToMint([fromMint, mint]);
  };

  //
  // Execute the transactions to perform the swap.
  //
  // The Jupiter API returns between 1 and 3 transations to perform a swap
  // (setupTransaction, swapTransaction, cleanupTransaction). Additionally
  // the wrapping of SOL (if required) is handled here by the wrapTransaction
  // step at the beginning.
  //
  // Jupiter does offer an API parameter to handle wrapping and unwrapping of
  // SOL but it is not used because it is difficult to ensure that the users
  // wSOL account and balance are retained.
  //
  const executeSwap = async () => {
    // Stop polling for route updates when swap is finalised
    stopRoutePolling();

    const wrapTransaction = transactions?.["wrapTransaction"];
    if (wrapTransaction) {
      try {
        await sendAndConfirmTransaction(wrapTransaction);
      } catch (e) {
        console.log("wrap error", e);
        // Irrecoverable, display error to the user
        return false;
      }

      console.log("wrap complete");
    }

    // Jupiter setup transaction
    // TODO: can we move the transactions from the wrapping above into this transaction
    const setupTransaction = transactions?.["setupTransaction"];
    if (setupTransaction) {
      try {
        await sendAndConfirmTransaction(setupTransaction);
      } catch (e) {
        console.log("setup swap error", e);
        return false;
      }

      console.log("setup complete");
    }

    let unwrapTransaction: string | undefined = undefined;
    // Jupiter swap transaction
    const swapTransaction = transactions?.["swapTransaction"];
    if (swapTransaction) {
      let signature: string;
      try {
        signature = await sendAndConfirmTransaction(swapTransaction);
      } catch (e) {
        console.log("swap error", e);
        // Wrap and setup transactions didn't exist or succeeded, so update the
        // transactions required to execute to only the remaining
        // transactions so the user can retry (i.e. exclude setup transactions)
        if (transactions) {
          const { swapTransaction } = transactions;
          setTransactions({
            swapTransaction,
          });
        }
        return false;
      }

      console.log("swap complete");

      if (needsUnwrap && !isUnwrap) {
        // We need to unwrap an amount of wSOL that is determined by the result
        // of the swap. Look at the parsed transaction to determine the wSOL
        // delta and unwrap that amount.
        const transactionData = await connection.getParsedTransaction(
          signature
        );
        if (!transactionData || !transactionData.meta) {
          console.log("could not retrieve transaction data");
        } else {
          // Get the wSOL balance delta from the swap transaction
          const preBalanceToken = transactionData.meta.preTokenBalances?.find(
            (a) =>
              a.mint === WSOL_MINT && a.owner === wallet.publicKey.toString()
          );
          const postBalanceToken = transactionData.meta.postTokenBalances?.find(
            (a) =>
              a.mint === WSOL_MINT && a.owner === wallet.publicKey.toString()
          );

          if (preBalanceToken && postBalanceToken) {
            const wrappedSolBalanceDelta =
              transactionData.meta.postBalances[postBalanceToken.accountIndex] -
              transactionData.meta.preBalances[preBalanceToken.accountIndex];
            console.log("need to unwrap", wrappedSolBalanceDelta);
            unwrapTransaction = (
              await generateUnwrapSolTx(
                solanaCtx,
                wallet.publicKey,
                wrappedSolBalanceDelta
              )
            ).toString("base64");
          }
        }
      }
    }

    if (needsUnwrap && isUnwrap) {
      // SOL -> wSOL unwrap for a fixed amount, not dependent on swap output
      unwrapTransaction = (
        await generateUnwrapSolTx(
          solanaCtx,
          wallet.publicKey,
          toAmount! * 10 ** 9
        )
      ).toString("base64");
    }

    if (unwrapTransaction) {
      try {
        await sendAndConfirmTransaction(unwrapTransaction);
      } catch (e) {
        console.log("unwrap error", e);
        if (isUnwrap) {
          return false;
        } else {
          // Only the unwrap failed, return true to display success in the UI
          // as the only failure is wSOL cleanup, but the currency swap still
          // occurred
          // TODO: handle this somehow?
          return true;
        }
      }
      console.log("unwrap complete");
    }

    // Note we are ignoring any Jupiter cleanup transaction, which is just a SOL unwrap

    return true;
  };

  const sendAndConfirmTransaction = async (serializedTransaction: string) => {
    const signature = await background.request({
      method: UI_RPC_METHOD_SIGN_AND_SEND_TRANSACTION,
      params: [
        bs58.encode(Buffer.from(serializedTransaction, "base64")),
        wallet.publicKey,
      ],
    });
    await confirmTransaction(connection, signature, "confirmed");
    return signature;
  };

  return (
    <_SwapContext.Provider
      value={{
        fromAmount,
        setFromAmount,
        toAmount,
        toMint,
        setToMint,
        fromMint,
        setFromMint,
        swapToFromMints,
        fromToken: fromToken.toString(),
        fromMintInfo,
        toToken: toToken.toString(),
        toMintInfo,
        slippage,
        setSlippage,
        executeSwap,
        priceImpactPct,
        isLoadingRoutes,
        transactions,
        isLoadingTransactions,
        transactionFee,
        isLoadingTransactionFee,
        isJupiterError,
      }}
    >
      {props.children}
    </_SwapContext.Provider>
  );
}

export function useSwapContext(): SwapContext {
  const ctx = useContext(_SwapContext);
  if (ctx === null) {
    throw new Error("Context not available");
  }
  return ctx;
}
