import * as store from "@coral-xyz/background/src/backend/store";
import { DefaultKeyname } from "@coral-xyz/background/src/backend/store";
import type {
  BlockchainKeyringJson,
  WalletDescriptor,
} from "@coral-xyz/common";
import { getLogger } from "@coral-xyz/common";
import * as bs58 from "bs58";

import type {
  HdKeyring,
  HdKeyringFactory,
  Keyring,
  KeyringFactory,
  KeystoneKeyring,
  KeystoneKeyringFactory,
  LedgerKeyring,
  LedgerKeyringFactory,
} from "./types";

const logger = getLogger("background/backend/keyring");

// Represents key data for a single blockchain network, e.g., solana or ethereum.
export class BlockchainKeyring {
  private hdKeyringFactory: HdKeyringFactory;
  private keyringFactory: KeyringFactory;
  private ledgerKeyringFactory: LedgerKeyringFactory;
  private keystoneKeyringFactory: KeystoneKeyringFactory;
  private hdKeyring?: HdKeyring;
  private importedKeyring?: Keyring;
  public ledgerKeyring?: LedgerKeyring;
  public keystoneKeyring?: KeystoneKeyring;
  private activeWallet?: string;
  private deletedWallets?: Array<string>;

  constructor(
    hdKeyringFactory: HdKeyringFactory,
    keyringFactory: KeyringFactory,
    ledgerKeyringFactory: LedgerKeyringFactory,
    keystoneKeyringFactory: KeystoneKeyringFactory
  ) {
    this.hdKeyringFactory = hdKeyringFactory;
    this.keyringFactory = keyringFactory;
    this.ledgerKeyringFactory = ledgerKeyringFactory;
    this.keystoneKeyringFactory = keystoneKeyringFactory;
  }

  public publicKeys(): {
    hdPublicKeys: Array<string>;
    importedPublicKeys: Array<string>;
    ledgerPublicKeys: Array<string>;
    keystonePublicKeys: Array<string>;
  } {
    const hdPublicKeys = this.hdKeyring ? this.hdKeyring.publicKeys() : [];
    const importedPublicKeys = this.importedKeyring
      ? this.importedKeyring.publicKeys()
      : [];
    const ledgerPublicKeys = this.ledgerKeyring
      ? this.ledgerKeyring.publicKeys()
      : [];
    const keystonePublicKeys = this.keystoneKeyring
      ? this.keystoneKeyring.publicKeys()
      : [];
    return {
      hdPublicKeys,
      importedPublicKeys,
      ledgerPublicKeys,
      keystonePublicKeys,
    };
  }

  public async initFromMnemonic(
    mnemonic: string,
    derivationPaths: Array<string>
  ): Promise<Array<[string, string]>> {
    // Initialize keyrings.
    this.hdKeyring = this.hdKeyringFactory.init(mnemonic, derivationPaths);
    // Empty ledger keyring to hold one off ledger imports
    this.ledgerKeyring = this.ledgerKeyringFactory.init([]);
    // Empty imported keyring to hold imported secret keys
    this.importedKeyring = this.keyringFactory.init([]);
    this.keystoneKeyring = this.keystoneKeyringFactory.fromAccounts([], '');
    this.activeWallet = this.hdKeyring.publicKeys()[0];
    this.deletedWallets = [];

    // Persist a given name for this wallet.
    const newAccounts: Array<[string, string]> = [];
    for (const [index, publicKey] of this.hdKeyring.publicKeys().entries()) {
      const name = DefaultKeyname.defaultDerived(index + 1);
      await store.setKeyname(publicKey, name);
      newAccounts.push([publicKey, name]);
    }
    return newAccounts;
  }

  public async initFromLedger(
    walletDescriptors: Array<WalletDescriptor>
  ): Promise<Array<[string, string]>> {
    // Empty ledger keyring to hold one off ledger imports
    this.ledgerKeyring = this.ledgerKeyringFactory.init(walletDescriptors);
    // Empty imported keyring to hold imported secret keys
    this.importedKeyring = this.keyringFactory.init([]);
    this.activeWallet = this.ledgerKeyring.publicKeys()[0];
    this.keystoneKeyring = this.keystoneKeyringFactory.fromAccounts([], '');
    this.deletedWallets = [];

    // Persist a given name for this wallet.
    const newAccounts: Array<[string, string]> = [];
    for (const [index, walletDescriptor] of walletDescriptors.entries()) {
      const name = DefaultKeyname.defaultLedger(index + 1);
      await store.setKeyname(walletDescriptor.publicKey, name);
      await store.setIsCold(walletDescriptor.publicKey, true);
      newAccounts.push([walletDescriptor.publicKey, name]);
    }
    return newAccounts;
  }

  public async initFromKeystone(
    accounts: Array<WalletDescriptor>,
    xfp: string
  ): Promise<Array<[string, string]>> {
    this.keystoneKeyring = this.keystoneKeyringFactory.fromAccounts(accounts, xfp);
    // Empty imported and ledger keyring
    this.ledgerKeyring = this.ledgerKeyringFactory.init([]);
    this.importedKeyring = this.keyringFactory.init([]);
    this.activeWallet = this.ledgerKeyring.publicKeys()[0];
    this.deletedWallets = [];

    // Persist a given name for this wallet.
    const newAccounts: Array<[string, string]> = [];
    for (const [index, walletDescriptor] of accounts.entries()) {
      const name = DefaultKeyname.defaultKeystone(index + 1);
      await store.setKeyname(walletDescriptor.publicKey, name);
      await store.setIsCold(walletDescriptor.publicKey, true);
      newAccounts.push([walletDescriptor.publicKey, name]);
    }
    return newAccounts;
  }

  public exportSecretKey(pubkey: string): string {
    let sk = this.hdKeyring?.exportSecretKey(pubkey);
    if (sk) {
      return sk;
    }
    sk = this.importedKeyring?.exportSecretKey(pubkey);
    if (sk) {
      return sk;
    }
    throw new Error(`unable to find keypair for ${pubkey}`);
  }

  public mnemonic(): string {
    return this.hdKeyring!.mnemonic;
  }

  public nextDerivationPath(keyring: "hd" | "ledger") {
    if (keyring === "hd") {
      return this.hdKeyring!.nextDerivationPath();
    } else {
      return this.ledgerKeyring!.nextDerivationPath();
    }
  }

  public async deriveNextKey(): Promise<{
    publicKey: string;
    derivationPath: string;
    name: string;
  }> {
    const { publicKey, derivationPath } = this.hdKeyring!.deriveNextKey();
    // Save a default name.
    const name = DefaultKeyname.defaultDerived(
      this.hdKeyring!.publicKeys().length
    );
    await store.setKeyname(publicKey, name);
    return { publicKey, derivationPath, name };
  }

  public async addDerivationPath(
    derivationPath: string
  ): Promise<{ publicKey: string; name: string }> {
    const publicKey = this.hdKeyring!.addDerivationPath(derivationPath);

    // Save a default name.
    const name = DefaultKeyname.defaultDerived(
      this.hdKeyring!.publicKeys().length
    );
    await store.setKeyname(publicKey, name);

    return {
      publicKey,
      name,
    };
  }

  public async importSecretKey(
    secretKey: string,
    name: string
  ): Promise<[string, string]> {
    const pubkey = this.importedKeyring!.importSecretKey(secretKey).toString();
    if (!name || name.length === 0) {
      name = DefaultKeyname.defaultImported(
        this.importedKeyring!.publicKeys().length
      );
    }
    await store.setKeyname(pubkey, name);
    return [pubkey, name];
  }

  public getActiveWallet(): string | undefined {
    return this.activeWallet;
  }

  public async activeWalletUpdate(newWallet: string) {
    this.activeWallet = newWallet;
  }

  public async keyDelete(publicKey: string) {
    const keyring = this.getKeyring(publicKey);
    if (!keyring) {
      logger.error(
        `unable to find key to delete in keyring store: ${publicKey}`
      );
      throw new Error("public key not found");
    }
    keyring.deletePublicKey(publicKey);
  }

  public toJson(): BlockchainKeyringJson {
    if (!this.importedKeyring || !this.ledgerKeyring || !this.keystoneKeyring) {
      throw new Error("blockchain keyring is locked");
    }
    return {
      hdKeyring: this.hdKeyring ? this.hdKeyring.toJson() : undefined,
      importedKeyring: this.importedKeyring.toJson(),
      ledgerKeyring: this.ledgerKeyring.toJson(),
      keystoneKeyring: this.keystoneKeyring.toJson(),
      activeWallet: this.activeWallet!,
      deletedWallets: this.deletedWallets!,
    };
  }

  public fromJson(json: BlockchainKeyringJson): void {
    const {
      hdKeyring,
      importedKeyring,
      ledgerKeyring,
      keystoneKeyring,
      activeWallet,
      deletedWallets,
    } = json;
    this.hdKeyring = hdKeyring
      ? this.hdKeyringFactory.fromJson(hdKeyring)
      : undefined;
    this.importedKeyring = this.keyringFactory.fromJson(importedKeyring);
    this.ledgerKeyring = this.ledgerKeyringFactory.fromJson(ledgerKeyring);
    this.keystoneKeyring = this.keystoneKeyringFactory.fromJson(keystoneKeyring);
    this.activeWallet = activeWallet;
    this.deletedWallets = deletedWallets;
  }

  //
  // For Solana txMsg is a Message, i.e. not a full transaction.
  // Ref https://docs.solana.com/developing/programming-model/transactions#message-format
  // For Ethereum txMsg is the full transaction, base58 encoded to keep the argument types same.
  //
  public async signTransaction(
    txMsg: string,
    walletAddress: string
  ): Promise<string> {
    const keyring = this.getKeyring(walletAddress);
    const msg = Buffer.from(bs58.decode(txMsg));
    return keyring.signTransaction(msg, walletAddress);
  }

  public async signMessage(
    msg: string,
    walletAddress: string
  ): Promise<string> {
    const keyring = this.getKeyring(walletAddress);
    const msgBuffer = Buffer.from(bs58.decode(msg));
    return keyring.signMessage(msgBuffer, walletAddress);
  }

  private getKeyring(publicKey: string): Keyring {
    for (const keyring of [
      this.hdKeyring,
      this.importedKeyring,
      this.ledgerKeyring,
      this.keystoneKeyring,
    ]) {
      if (keyring && keyring.publicKeys().find((k) => k === publicKey)) {
        return keyring;
      }
    }
    throw new Error("no keyring for public key");
  }

  public hasPublicKey(publicKey: string): boolean {
    try {
      this.getKeyring(publicKey);
      return true;
    } catch {
      return false;
    }
  }
}
