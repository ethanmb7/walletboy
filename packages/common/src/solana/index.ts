import BN from "bn.js";
import type {
  TransactionInstruction,
  Commitment,
  Connection,
} from "@solana/web3.js";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
} from "@solana/spl-token";
import type { TokenInfo } from "@solana/spl-token-registry";
import * as anchor from "@project-serum/anchor";
import type { Program, SplToken } from "@project-serum/anchor";
import {
  associatedTokenAddress,
  SOL_NATIVE_MINT,
  WSOL_MINT,
} from "./programs/token";
import * as assertOwner from "./programs/assert-owner";
import { SolanaProvider } from "./provider";
import type { BackgroundClient } from "../";

export * from "./wallet-adapter";
export * from "./explorer";
export * from "./cluster";
export * from "./provider";
export * from "./programs";
export * from "./background-connection";

export type SolanaContext = {
  walletPublicKey: PublicKey;
  tokenClient: Program<SplToken>;
  connection: Connection;
  registry: Map<string, TokenInfo>;
  commitment: Commitment;
  backgroundClient: BackgroundClient;
};

//
// API for performing Solana actions.
//
export class Solana {
  public static async transferToken(
    ctx: SolanaContext,
    req: TransferTokenRequest
  ): Promise<string> {
    const { walletPublicKey, registry, tokenClient, commitment } = ctx;
    const { mint, destination, amount } = req;

    const decimals = (() => {
      if (req.decimals !== undefined) {
        return req.decimals;
      }
      const tokenInfo = registry.get(mint.toString());
      if (!tokenInfo) {
        throw new Error("no token info found");
      }
      const decimals = tokenInfo.decimals;
      return decimals;
    })();
    const nativeAmount = new BN(amount * 10 ** decimals);

    const destinationAta = associatedTokenAddress(mint, destination);
    const sourceAta = associatedTokenAddress(mint, walletPublicKey);

    const [destinationAccount, destinationAtaAccount] =
      await anchor.utils.rpc.getMultipleAccounts(
        tokenClient.provider.connection,
        [destination, destinationAta],
        commitment
      );

    //
    // Require the account to either be a system program account or a brand new
    // account.
    //
    if (
      destinationAccount &&
      !destinationAccount.account.owner.equals(SystemProgram.programId)
    ) {
      throw new Error("invalid account");
    }

    // Instructions to execute prior to the transfer.
    const preInstructions: Array<TransactionInstruction> = [];
    if (!destinationAtaAccount) {
      preInstructions.push(
        assertOwner.assertOwnerInstruction({
          account: destination,
          owner: SystemProgram.programId,
        })
      );
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          walletPublicKey,
          destinationAta,
          destination,
          mint
        )
      );
    }

    const tx = await tokenClient.methods
      .transferChecked(nativeAmount, decimals)
      .accounts({
        source: sourceAta,
        mint,
        destination: destinationAta,
        authority: walletPublicKey,
      })
      .preInstructions(preInstructions)
      .transaction();
    tx.feePayer = walletPublicKey;
    tx.recentBlockhash = (
      await tokenClient.provider.connection.getLatestBlockhash(commitment)
    ).blockhash;
    const signedTx = await SolanaProvider.signTransaction(ctx, tx);
    const rawTx = signedTx.serialize();

    return await tokenClient.provider.connection.sendRawTransaction(rawTx, {
      skipPreflight: true,
      preflightCommitment: commitment,
    });
  }

  public static async transferSol(
    ctx: SolanaContext,
    req: TransferSolRequest
  ): Promise<string> {
    const { walletPublicKey, tokenClient, commitment } = ctx;
    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(req.source),
        toPubkey: new PublicKey(req.destination),
        lamports: req.amount * 10 ** 9,
      })
    );
    tx.feePayer = walletPublicKey;
    tx.recentBlockhash = (
      await tokenClient.provider.connection.getLatestBlockhash(commitment)
    ).blockhash;
    const signedTx = await SolanaProvider.signTransaction(ctx, tx);
    const rawTx = signedTx.serialize();

    return await ctx.tokenClient.provider.connection.sendRawTransaction(rawTx, {
      skipPreflight: false,
      preflightCommitment: ctx.commitment,
    });
  }

  public static async wrapSol(
    ctx: SolanaContext,
    req: WrapSolRequest
  ): Promise<string> {
    const { destination, amount } = req;
    const rawTx = await generateWrapSolTx(ctx, destination, amount);
    return await ctx.tokenClient.provider.connection.sendRawTransaction(rawTx, {
      skipPreflight: false,
      preflightCommitment: ctx.commitment,
    });
  }

  public static async unwrapSol(
    ctx: SolanaContext,
    req: UnwrapSolRequest
  ): Promise<string> {
    const { destination, amount } = req;
    const rawTx = await generateUnwrapSolTx(ctx, destination, amount);
    return await ctx.tokenClient.provider.connection.sendRawTransaction(rawTx, {
      skipPreflight: false,
      preflightCommitment: ctx.commitment,
    });
  }
}

export const generateWrapSolTx = async (
  ctx: SolanaContext,
  destination: PublicKey,
  amount: number
) => {
  const { walletPublicKey, tokenClient, commitment } = ctx;
  const destinationAta = associatedTokenAddress(
    new PublicKey(SOL_NATIVE_MINT),
    destination
  );

  const [destinationAccount, destinationAtaAccount] =
    await anchor.utils.rpc.getMultipleAccounts(
      tokenClient.provider.connection,
      [destination, destinationAta],
      commitment
    );

  //
  // Require the account to either be a system program account or a brand new
  // account.
  //
  if (
    destinationAccount &&
    !destinationAccount.account.owner.equals(SystemProgram.programId)
  ) {
    throw new Error("invalid account");
  }

  const tx = new Transaction();
  tx.instructions = generateWrapSolIx({
    destination,
    destinationAta,
    destinationAtaAccount,
    amount,
    walletPublicKey,
  });
  tx.feePayer = walletPublicKey;
  tx.recentBlockhash = (
    await tokenClient.provider.connection.getLatestBlockhash(commitment)
  ).blockhash;
  const signedTx = await SolanaProvider.signTransaction(ctx, tx);
  return signedTx.serialize();
};

export const generateUnwrapSolTx = async (
  ctx: SolanaContext,
  destination: PublicKey,
  amount: number
) => {
  const { walletPublicKey, tokenClient, commitment } = ctx;
  // Unwrapping partial SOL amounts appears to not be possible in token program.
  // This unwrap works by closing the account, and then creating a new wSOL account
  // and transferring the difference between the previous amount and the requested
  // amount into the newly created account.
  const destinationAta = associatedTokenAddress(
    new PublicKey(SOL_NATIVE_MINT),
    destination
  );

  const [destinationAccount, destinationAtaAccount] =
    await anchor.utils.rpc.getMultipleAccounts(
      tokenClient.provider.connection,
      [destination, destinationAta],
      commitment
    );

  if (!destinationAtaAccount) {
    throw new Error("expected wSOL account to exist");
  }

  //
  // Require the account to either be a system program account or a brand new
  // account.
  //
  if (
    destinationAccount &&
    !destinationAccount.account.owner.equals(SystemProgram.programId)
  ) {
    throw new Error("invalid account");
  }

  const tx = new Transaction();
  const instructions = generateWrapSolIx({
    destination,
    destinationAta,
    destinationAtaAccount,
    amount,
    walletPublicKey,
  });
  // TODO add close account instruction
  tx.instructions = instructions;
  tx.feePayer = walletPublicKey;
  tx.recentBlockhash = (
    await tokenClient.provider.connection.getLatestBlockhash(commitment)
  ).blockhash;
  const signedTx = await SolanaProvider.signTransaction(ctx, tx);
  return signedTx.serialize();
};

// General instructions required to create a wSOL account if one doesn't exist
// and then transfer SOL.
const generateWrapSolIx = ({
  destination,
  destinationAta,
  destinationAtaAccount,
  amount,
  walletPublicKey,
}) => {
  const ix: TransactionInstruction[] = [];
  if (!destinationAtaAccount) {
    ix.push(
      createAssociatedTokenAccountInstruction(
        walletPublicKey,
        destinationAta,
        destination,
        new PublicKey(SOL_NATIVE_MINT)
      )
    );
  }

  ix.push(
    SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: new PublicKey(destinationAta),
      lamports: amount * 10 ** 9,
    })
  );

  ix.push(createSyncNativeInstruction(new PublicKey(destinationAta)));
  return ix;
};

export type TransferTokenRequest = {
  // SOL address.
  destination: PublicKey;
  mint: PublicKey;
  amount: number;
  decimals?: number;
};

export type TransferSolRequest = {
  // SOL address.
  source: PublicKey;
  // SOL address.
  destination: PublicKey;
  amount: number;
};

export type WrapSolRequest = {
  // SOL address.
  destination: PublicKey;
  amount: number;
};

export type UnwrapSolRequest = {
  // SOL address.
  destination: PublicKey;
  amount: number;
};
