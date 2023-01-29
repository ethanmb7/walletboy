import type {
  HdKeyring,
  HdKeyringFactory,
  HdKeyringJson,
  Keyring,
  KeyringFactory,
  KeyringJson,
  LedgerKeyring,
  LedgerKeyringJson,
} from "@coral-xyz/blockchain-keyring";
import { LedgerKeyringBase } from "@coral-xyz/blockchain-keyring";
import type { PublicKeyPath } from "@coral-xyz/common";
import {
  LEDGER_METHOD_ETHEREUM_SIGN_MESSAGE,
  LEDGER_METHOD_ETHEREUM_SIGN_TRANSACTION,
} from "@coral-xyz/common";
import { mnemonicToSeedSync, validateMnemonic } from "bip39";
import type { Wallet } from "ethers";
import { ethers } from "ethers";

export class EthereumKeyringFactory implements KeyringFactory {
  init(secretKeys: Array<string>): Keyring {
    const wallets = secretKeys.map((secretKey) => {
      return new ethers.Wallet(secretKey);
    });
    return new EthereumKeyring(wallets);
  }

  fromJson(payload: KeyringJson): Keyring {
    const wallets = payload.secretKeys.map((secret: string) => {
      return new ethers.Wallet(Buffer.from(secret, "hex").toString());
    });
    return new EthereumKeyring(wallets);
  }
}

export class EthereumKeyring implements Keyring {
  constructor(public wallets: Array<Wallet>) {}

  public publicKeys(): Array<string> {
    return this.wallets.map((w) => w.address);
  }

  public deletePublicKey(publicKey: string) {
    this.wallets = this.wallets.filter((w) => w.address !== publicKey);
  }

  public importSecretKey(secretKey: string): string {
    const wallet = new ethers.Wallet(secretKey);
    this.wallets.push(wallet);
    return wallet.address;
  }

  public exportSecretKey(address: string): string | null {
    const wallet = this.wallets.find((w) => w.address === address);
    return wallet ? wallet.privateKey : null;
  }

  public async signTransaction(
    serializedTx: Buffer,
    signerAddress: string
  ): Promise<string> {
    const wallet = this.wallets.find((w) => w.address === signerAddress);
    if (!wallet) {
      throw new Error(`unable to find ${signerAddress.toString()}`);
    }
    const tx = ethers.utils.parseTransaction(
      ethers.utils.hexlify(serializedTx)
    );
    return await wallet.signTransaction(
      tx as ethers.providers.TransactionRequest
    );
  }

  public async signMessage(
    message: Buffer,
    signerAddress: string
  ): Promise<string> {
    const wallet = this.wallets.find((w) => w.address === signerAddress);
    if (!wallet) {
      throw new Error(`unable to find ${signerAddress.toString()}`);
    }
    return await wallet.signMessage(message.toString());
  }

  public toJson(): any {
    return {
      // Private keys, just using the Solana secret key nomenclature
      secretKeys: this.wallets.map((w) =>
        Buffer.from(w.privateKey).toString("hex")
      ),
    };
  }
}

export class EthereumHdKeyringFactory implements HdKeyringFactory {
  public init(mnemonic: string, derivationPaths: Array<string>): HdKeyring {
    if (!validateMnemonic(mnemonic)) {
      throw new Error("Invalid seed words");
    }
    const seed = mnemonicToSeedSync(mnemonic);
    const wallets = derivationPaths.map((path) =>
      ethers.Wallet.fromMnemonic(mnemonic, path)
    );
    return new EthereumHdKeyring({
      mnemonic,
      seed,
      wallets,
    });
  }

  // @ts-ignore
  public fromJson(obj: HdKeyringJson): HdKeyring {
    const { mnemonic, seed: seedStr, derivationPaths } = obj;
    const seed = Buffer.from(seedStr, "hex");
    const wallets = derivationPaths.map((path) =>
      ethers.Wallet.fromMnemonic(mnemonic, path)
    );
    return new EthereumHdKeyring({
      mnemonic,
      seed,
      wallets,
    });
  }
}

export class EthereumHdKeyring extends EthereumKeyring implements HdKeyring {
  readonly mnemonic: string;
  private seed: Buffer;

  constructor({
    mnemonic,
    seed,
    wallets,
  }: {
    mnemonic: string;
    seed: Buffer;
    wallets: Array<Wallet>;
  }) {
    super(wallets);
    this.mnemonic = mnemonic;
    this.seed = seed;
  }

  deriveNextKey(): [string, string, string] {
    return ["", "", ""];
  }

  addDerivationPath(derivationPath: string): [string, string] {
    return ["", ""];
  }

  // @ts-ignore
  public toJson(): HdKeyringJson {
    return {
      mnemonic: this.mnemonic,
      seed: this.seed.toString("hex"),
      // Serialize wallets as derivation paths
      derivationPaths: this.wallets.map((w) => w.mnemonic.path),
    };
  }
}

export class EthereumLedgerKeyringFactory {
  public init(publicKeyPaths: Array<PublicKeyPath>): LedgerKeyring {
    return new EthereumLedgerKeyring(publicKeyPaths);
  }

  public fromJson(obj: LedgerKeyringJson): LedgerKeyring {
    return new EthereumLedgerKeyring(obj.publicKeyPaths);
  }
}

export class EthereumLedgerKeyring
  extends LedgerKeyringBase
  implements LedgerKeyring
{
  public async signTransaction(
    serializedTx: Buffer,
    publicKey: string
  ): Promise<string> {
    const publicKeyPath = this.publicKeyPaths.find(
      (p) => p.publicKey === publicKey
    );
    if (!publicKeyPath) {
      throw new Error("ledger public key not found");
    }
    const tx = ethers.utils.parseTransaction(
      ethers.utils.hexlify(serializedTx)
    );
    return await this.request({
      method: LEDGER_METHOD_ETHEREUM_SIGN_TRANSACTION,
      params: [tx, publicKeyPath.derivationPath],
    });
  }

  public async signMessage(msg: Buffer, publicKey: string): Promise<string> {
    const publicKeyPath = this.publicKeyPaths.find(
      (p) => p.publicKey === publicKey
    );
    if (!publicKeyPath) {
      throw new Error("ledger public key not found");
    }
    return await this.request({
      method: LEDGER_METHOD_ETHEREUM_SIGN_MESSAGE,
      params: [msg, publicKeyPath.derivationPath],
    });
  }
}
