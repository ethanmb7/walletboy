import {
  hdFactoryForBlockchain,
  keyringForBlockchain,
} from "@coral-xyz/blockchain-common";
import type { BlockchainKeyring } from "@coral-xyz/blockchain-keyring";
import { SolanaKeystoneKeyring } from '@coral-xyz/blockchain-solana';
import type {
  AutolockSettingsOption,
  EventEmitter,
  KeyringInit,
  KeyringType,
  UR,
  WalletDescriptor} from "@coral-xyz/common";
import {
  BACKEND_API_URL,
  BACKEND_EVENT,
  Blockchain,
  DEFAULT_AUTO_LOCK_INTERVAL_SECS,
  defaultPreferences,
  getBlockchainFromPath,
  NOTIFICATION_KEYRING_STORE_LOCKED,
} from "@coral-xyz/common";
import type { KeyringStoreState} from "@coral-xyz/recoil";
import { KeyringStoreStateEnum  } from "@coral-xyz/recoil";
import { generateMnemonic } from "bip39";

import type { KeyringStoreJson, User, UserKeyringJson } from "../store";
import * as store from "../store";
import { DefaultKeyname } from "../store";

/**
 * KeyringStore API for managing all wallet keys .
 */
export class KeyringStore {
  private lastUsedTs: number;
  private password?: string;

  private autoLockCountdown: {
    start: () => void;
    restart: () => void;
    toggle: (enabled: boolean) => void;
  };

  private events: EventEmitter;
  private users: Map<string, UserKeyring>;
  // Must be undefined when the keyring-store is locked or uninitialized.
  private activeUserUuid?: string;

  ///////////////////////////////////////////////////////////////////////////////
  // Getters.
  ///////////////////////////////////////////////////////////////////////////////

  public get activeUserKeyring(): UserKeyring {
    if (!this.activeUserUuid) {
      throw new Error("invariant violation: activeUserUuid is undefined");
    }
    const kr = this.users.get(this.activeUserUuid)!;
    if (!kr) {
      throw new Error("invariant violation: activeUserKeyring not found");
    }
    return kr;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Initialization.
  ///////////////////////////////////////////////////////////////////////////////

  constructor(events: EventEmitter) {
    this.users = new Map();
    this.lastUsedTs = 0;
    this.events = events;

    this.autoLockCountdown = (() => {
      let autoLockCountdownTimer: ReturnType<typeof setTimeout>;

      let secondsUntilAutoLock: number | undefined;
      let autoLockIsEnabled = true;

      let shouldLockImmediatelyWhenClosed = false;
      let lockImmediatelyWhenClosedCountdown: ReturnType<typeof setTimeout>;
      const SECONDS_UNTIL_LOCK_WHEN_CLOSED = 0.5;

      const lock = () => {
        if (!autoLockIsEnabled) return;
        this.lock();
        this.events.emit(BACKEND_EVENT, {
          name: NOTIFICATION_KEYRING_STORE_LOCKED,
        });
      };

      const startAutoLockCountdownTimer = () => {
        stopAutoLockCountdownTimer();
        stopLockWhenClosedCountdownTimer();
        if (!secondsUntilAutoLock || !autoLockIsEnabled) return;
        autoLockCountdownTimer = setTimeout(lock, secondsUntilAutoLock * 1000);
      };

      const stopAutoLockCountdownTimer = () => {
        if (autoLockCountdownTimer) clearTimeout(autoLockCountdownTimer);
      };

      const stopLockWhenClosedCountdownTimer = () => {
        if (lockImmediatelyWhenClosedCountdown)
          clearTimeout(lockImmediatelyWhenClosedCountdown);
      };

      globalThis.chrome?.runtime.onConnect.addListener((port) => {
        port.onDisconnect.addListener(() => {
          // Force-enable the auto-lock countdown if the popup is closed
          autoLockIsEnabled = true;
          if (shouldLockImmediatelyWhenClosed) {
            lockImmediatelyWhenClosedCountdown = setTimeout(() => {
              stopAutoLockCountdownTimer();
              lock();
            }, SECONDS_UNTIL_LOCK_WHEN_CLOSED * 1000);
          } else {
            startAutoLockCountdownTimer();
          }
        });
      });

      return {
        start: () => {
          // Get the auto-lock interval from the
          // user's preferences and start the countdown timer.
          store
            .getWalletDataForUser(this.activeUserUuid!)
            .then(({ autoLockSettings, autoLockSecs }) => {
              switch (autoLockSettings?.option) {
                case "never":
                  shouldLockImmediatelyWhenClosed = false;
                  secondsUntilAutoLock = undefined;
                  break;
                case "onClose":
                  shouldLockImmediatelyWhenClosed = true;
                  secondsUntilAutoLock = undefined;
                  break;
                default:
                  shouldLockImmediatelyWhenClosed = false;
                  secondsUntilAutoLock =
                    // Try to use read the new style (>0.4.0) value first
                    autoLockSettings?.seconds ||
                    // if that doesn't exist check for a legacy (<=0.4.0) value
                    autoLockSecs ||
                    // otherwise fall back to the default value
                    DEFAULT_AUTO_LOCK_INTERVAL_SECS;
              }
              startAutoLockCountdownTimer();
            });
        },
        restart: () => {
          // Reset the countdown timer and start it again.
          startAutoLockCountdownTimer();
        },
        toggle: (enabled: boolean) => {
          autoLockIsEnabled = enabled;
          startAutoLockCountdownTimer();
        },
      };
    })();
  }

  // Initializes the keystore for the first time.
  public async init(
    username: string,
    password: string,
    keyringInit: KeyringInit,
    uuid: string,
    jwt: string
  ) {
    this.password = password;

    // Setup the user.
    await this._usernameKeyringCreate(username, keyringInit, uuid, jwt);

    // Persist the encrypted data to then store.
    await this.persist(true);

    // Automatically lock the store when idle.
    await this.tryUnlock({ password, uuid });
  }

  public async usernameKeyringCreate(
    username: string,
    keyringInit: KeyringInit,
    uuid: string,
    jwt: string
  ) {
    return await this.withUnlockAndPersist(async () => {
      return await this._usernameKeyringCreate(
        username,
        keyringInit,
        uuid,
        jwt
      );
    });
  }

  public async _usernameKeyringCreate(
    username: string,
    keyringInit: KeyringInit,
    uuid: string,
    jwt: string
  ) {
    // Store unlocked keyring in memory.
    this.users.set(uuid, await UserKeyring.init(username, keyringInit, uuid));
    this.activeUserUuid = uuid;

    // Per user preferences.
    await store.setWalletDataForUser(uuid, defaultPreferences());

    // Persist active user to disk.
    await store.setActiveUser({
      username,
      uuid,
      jwt,
    });
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Internal state machine queries.
  ///////////////////////////////////////////////////////////////////////////////

  public async state(): Promise<KeyringStoreState> {
    if (this.isUnlocked()) {
      return KeyringStoreStateEnum.Unlocked;
    }
    if (await this.isLocked()) {
      return KeyringStoreStateEnum.Locked;
    }
    return KeyringStoreStateEnum.NeedsOnboarding;
  }

  private async isLocked(): Promise<boolean> {
    if (this.isUnlocked()) {
      return false;
    }
    return await store.doesCiphertextExist();
  }

  private isUnlocked(): boolean {
    return (
      this.activeUserUuid !== undefined &&
      this.activeUserKeyring.blockchains.size > 0 &&
      this.lastUsedTs !== 0
    );
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Actions.
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Returns true if the active user was removed (and thus chanaged).
   */
  public async removeUser(uuid: string): Promise<boolean> {
    if (this.users.size <= 1) {
      throw new Error(
        "invariant violation: users map size must be greater than 1"
      );
    }
    return await this.withUnlockAndPersist(async () => {
      const user = this.users.get(uuid);
      if (!user) {
        throw new Error(`User not found: ${uuid}`);
      }
      this.users.delete(uuid);
      await store.setWalletDataForUser(uuid, undefined);

      //
      // If the active user is being removed, then auto switch it.
      //
      if (this.activeUserUuid === uuid) {
        const userData = await store.getUserData();
        const users = userData.users.filter((user) => user.uuid !== uuid);
        await store.setUserData({
          activeUser: users[0],
          users,
        });
        this.activeUserUuid = users[0].uuid;
        return true;
      } else {
        return false;
      }
    });
  }

  public async tryUnlock(userInfo: { password: string; uuid: string }) {
    return this.withLock(async () => {
      const json = await store.getKeyringStore(userInfo);
      await this.fromJson(json);

      // Must use this object, because the uuid may have been set during migration.
      // This will only happen in the event that the given uuid is empty.
      this.activeUserUuid = userInfo.uuid;

      this.password = userInfo.password;
      // Automatically lock the store when idle.
      // this.autoLockStart();
      this.autoLockCountdown.start();
    });
  }

  /**
   * Check if a password is valid by attempting to decrypt the stored keyring.
   */
  public async checkPassword(password: string) {
    try {
      await store.getKeyringStore_NO_MIGRATION(password);
      return true;
    } catch (err) {
      return false;
    }
  }

  public lock() {
    this.activeUserUuid = undefined; // Must be set to undefined here.
    this.users = new Map();
    this.lastUsedTs = 0;
  }

  // Preview public keys for a given mnemonic and derivation path without
  // importing the mnemonic.
  public async previewPubkeys(
    blockchain: Blockchain,
    mnemonic: string | true,
    derivationPaths: Array<string>
  ): Promise<string[]> {
    const factory = hdFactoryForBlockchain(blockchain);
    if (mnemonic === true) {
      // Read the mnemonic from the store
      return await this.withUnlock(async () => {
        mnemonic = this.activeUserKeyring.exportMnemonic();
        return factory.init(mnemonic, derivationPaths).publicKeys();
      });
    } else {
      return factory.init(mnemonic, derivationPaths).publicKeys();
    }
  }

  public reset() {
    // First lock to clear the keyring memory.
    this.lock();
    // Clear the jwt cookie if it exists.
    fetch(`${BACKEND_API_URL}/authenticate`, {
      method: "DELETE",
    });
    // Then reset persistent disk storage.
    return store.reset();
  }

  public async passwordUpdate(currentPassword: string, newPassword: string) {
    return this.withPasswordAndPersist(currentPassword, () => {
      this.password = newPassword;
    });
  }

  public async autoLockSettingsUpdate(
    seconds?: number,
    option?: AutolockSettingsOption
  ) {
    return await this.withUnlock(async () => {
      const data = await store.getWalletDataForUser(this.activeUserUuid!);
      await store.setWalletDataForUser(this.activeUserUuid!, {
        ...data,
        autoLockSettings: {
          seconds,
          option,
        },
      });

      this.autoLockCountdown.start();
    });
  }

  public keepAlive() {
    return this.withUnlock(() => {});
  }

  public createMnemonic(strength: number): string {
    const mnemonic = generateMnemonic(strength);
    return mnemonic;
  }

  public async activeUserUpdate(uuid: string): Promise<User> {
    const userData = await store.getUserData();
    const user = userData.users.filter((u) => u.uuid === uuid)[0];
    this.activeUserUuid = uuid;
    await store.setActiveUser(user);
    return user;
  }

  public autoLockCountdownToggle(enable: boolean) {
    this.autoLockCountdown.toggle(enable);
  }

  public autoLockCountdownRestart() {
    this.autoLockCountdown.restart();
  }

  public autoLockCountdownReset() {
    this.autoLockCountdown.start();
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Passes through to the active username keyring.
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Initialise a blockchain keyring.
   */
  public async blockchainKeyringAdd(
    blockchain: Blockchain,
    walletDescriptor: WalletDescriptor,
    xfp?: string,
    keyringType?: KeyringType,
    persist = true
  ): Promise<string> {
    await this.activeUserKeyring.blockchainKeyringAdd(
      blockchain,
      walletDescriptor,
      xfp,
      keyringType
    );
    if (persist) {
      await this.persist();
    }
    return walletDescriptor.publicKey;
  }

  /**
   * Remove a keyring. This shouldn't be exposed to the client as it can
   * use the blockchain disable method to soft remove a keyring and still be
   * able to enable it later without any reonboarding (signatures, etc). It
   * is used by the backend to revert state changes for non atomic call
   * sequences.
   */
  public async blockchainKeyringRemove(
    blockchain: Blockchain,
    persist = true
  ): Promise<void> {
    await this.activeUserKeyring.blockchainKeyringRemove(blockchain);
    if (persist) {
      await this.persist();
    }
  }

  // Import a secret key for the given blockchain.
  // TODO handle initialisation, allow init blockchain without mnemonic?
  public async importSecretKey(
    blockchain: Blockchain,
    secretKey: string,
    name: string
  ): Promise<[string, string]> {
    return await this.withUnlockAndPersist(async () => {
      return await this.activeUserKeyring.importSecretKey(
        blockchain,
        secretKey,
        name
      );
    });
  }

  public async nextDerivationPath(
    blockchain: Blockchain,
    keyring: "hd" | "ledger"
  ): Promise<string> {
    return await this.withUnlock(async () => {
      return this.activeUserKeyring.nextDerivationPath(blockchain, keyring);
    });
  }

  public async addDerivationPath(
    blockchain: Blockchain,
    derivationPath: string
  ): Promise<{ publicKey: string; name: string }> {
    return await this.withUnlock(async () => {
      return this.activeUserKeyring.addDerivationPath(
        blockchain,
        derivationPath
      );
    });
  }

  // Derive the next key for the given blockchain.
  public async deriveNextKey(
    blockchain: Blockchain
  ): Promise<{ publicKey: string; derivationPath: string; name: string }> {
    return await this.withUnlockAndPersist(async () => {
      return await this.activeUserKeyring.deriveNextKey(blockchain);
    });
  }

  public async keyDelete(blockchain: Blockchain, publicKey: string) {
    return await this.withUnlockAndPersist(async () => {
      return await this.activeUserKeyring.keyDelete(blockchain, publicKey);
    });
  }

  public async ledgerImport(
    blockchain: Blockchain,
    walletDescriptor: WalletDescriptor
  ) {
    return await this.withUnlockAndPersist(async () => {
      return await this.activeUserKeyring.ledgerImport(
        blockchain,
        walletDescriptor
      );
    });
  }

  public async keystoneImport(
    blockchain: Blockchain,
    ur: {type: string, cbor: string},
    pubkey?: string
  ) {
    return await this.withUnlockAndPersist(async () => {
      return await this.activeUserKeyring.keystoneImport(
        blockchain,
        ur,
        pubkey
      );
    });
  }

  public async keystoneURDecode(
    blockchain: Blockchain,
    ur: {type: string, cbor: string},
  ) {
    const keyring = blockchain === Blockchain.SOLANA ? await SolanaKeystoneKeyring.fromUR(ur) : null;
    return {
      accounts: keyring?.getCachedAccounts(),
      xfp: keyring?.getXFP(),
    };
  }

  /**
   * Update the active public key for the given blockchain.
   */
  public async activeWalletUpdate(
    newActivePublicKey: string,
    blockchain: Blockchain
  ) {
    return await this.withUnlockAndPersist(async () => {
      return await this.activeUserKeyring.activeWalletUpdate(
        newActivePublicKey,
        blockchain
      );
    });
  }

  /**
   * Return the public keys of all blockchain keyrings in the keyring.
   */
  public async publicKeys(): Promise<{
    [key: string]: {
      hdPublicKeys: Array<string>;
      importedPublicKeys: Array<string>;
      ledgerPublicKeys: Array<string>;
    };
  }> {
    return await this.withUnlock(async () => {
      return await this.activeUserKeyring.publicKeys();
    });
  }

  /**
   * Return all the active public keys for all enabled blockchains.
   */
  public async activeWallets(): Promise<string[]> {
    return this.withUnlock(async () => {
      return await this.activeUserKeyring.activeWallets();
    });
  }

  public exportSecretKey(password: string, publicKey: string): string {
    return this.withPassword(password, () => {
      return this.activeUserKeyring.exportSecretKey(publicKey);
    });
  }

  public exportMnemonic(password: string): string {
    return this.withPassword(password, () => {
      return this.activeUserKeyring.exportMnemonic();
    });
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Utilities.
  ///////////////////////////////////////////////////////////////////////////////

  private async withUnlockAndPersist<T>(fn: () => Promise<T>) {
    return await this.withUnlock(async () => {
      const resp = await fn();
      await this.persist();
      return resp;
    });
  }

  // Utility for asserting the wallet is currently unlocked.
  private withUnlock<T>(fn: () => T) {
    if (!this.isUnlocked()) {
      throw new Error("keyring store is not unlocked");
    }
    const resp = fn();
    this.updateLastUsed();
    return resp;
  }

  // Utility for asserting the wallet is currently locked.
  private withLock<T>(fn: () => T): T {
    if (this.isUnlocked()) {
      throw new Error("keyring store is not locked");
    }
    const resp = fn();
    this.updateLastUsed();
    return resp;
  }

  private withPasswordAndPersist<T>(currentPassword: string, fn: () => T) {
    return this.withPassword(currentPassword, () => {
      const resp = fn();
      this.persist();
      return resp;
    });
  }

  // Utility for asserting the wallet is unlocked and the correct password was
  // given.
  private withPassword<T>(currentPassword: string, fn: () => T) {
    return this.withUnlock(() => {
      if (currentPassword !== this.password) {
        throw new Error("incorrect password");
      }
      return fn();
    });
  }

  private async persist(forceBecauseCalledFromInit = false) {
    if (!forceBecauseCalledFromInit && !this.isUnlocked()) {
      throw new Error("attempted persist of locked keyring");
    }
    await store.setKeyringStore(this.toJson(), this.password!);
  }

  private updateLastUsed() {
    this.lastUsedTs = Date.now() / 1000;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Serialization.
  ///////////////////////////////////////////////////////////////////////////////

  private toJson(): KeyringStoreJson {
    // toJson on all the users
    const users = Object.fromEntries(
      [...this.users].map(([k, v]) => [k, v.toJson()])
    );
    return {
      users,
      lastUsedTs: this.lastUsedTs,
    };
  }

  private async fromJson(json: KeyringStoreJson) {
    const { users } = json;
    this.users = new Map(
      Object.entries(users).map(([username, obj]) => {
        return [username, UserKeyring.fromJson(obj)];
      })
    );
  }
}

// Holds all keys for a given username.
class UserKeyring {
  blockchains: Map<string, BlockchainKeyring>;
  username: string;
  uuid: string;
  private mnemonic?: string;
  activeBlockchain: Blockchain;

  ///////////////////////////////////////////////////////////////////////////////
  // Initialization.
  ///////////////////////////////////////////////////////////////////////////////

  constructor() {
    this.blockchains = new Map();
  }

  public static async init(
    username: string,
    keyringInit: KeyringInit,
    uuid: string
  ): Promise<UserKeyring> {
    const keyring = new UserKeyring();
    keyring.uuid = uuid;
    keyring.username = username;
    keyring.mnemonic = keyringInit.mnemonic;
    for (const signedWalletDescriptor of keyringInit.signedWalletDescriptors) {
      const blockchainKeyring = keyring.blockchains.get(
        getBlockchainFromPath(signedWalletDescriptor.derivationPath)
      );
      if (blockchainKeyring) {
        // Blockchain keyring already exists, just add the derivation path
        await blockchainKeyring.addDerivationPath(
          signedWalletDescriptor.derivationPath
        );
      } else {
        // No blockchain keyring, create it
        await keyring.blockchainKeyringAdd(
          getBlockchainFromPath(signedWalletDescriptor.derivationPath),
          signedWalletDescriptor
        );
      }
    }
    // Set the active wallet to be the first keyring.
    keyring.activeBlockchain = getBlockchainFromPath(
      keyringInit.signedWalletDescriptors[0].derivationPath
    );
    return keyring;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // State selectors.
  ///////////////////////////////////////////////////////////////////////////////

  public hasMnemonic(): boolean {
    return !!this.mnemonic;
  }

  /**
   * Return all the blockchains that have an initialised keyring even if they
   * are not enabled.
   */
  public blockchainKeyrings(): Array<Blockchain> {
    return [...this.blockchains.keys()].map((b) => b as Blockchain);
  }

  public async publicKeys(): Promise<{
    [key: string]: {
      hdPublicKeys: Array<string>;
      importedPublicKeys: Array<string>;
      ledgerPublicKeys: Array<string>;
    };
  }> {
    const entries = this.blockchainKeyrings().map((blockchain) => {
      const keyring = this.keyringForBlockchain(blockchain);
      return [blockchain, keyring.publicKeys()];
    });
    return Object.fromEntries(entries);
  }

  /**
   * Returns the keyring for a given blockchain.
   */
  public keyringForBlockchain(blockchain: Blockchain): BlockchainKeyring {
    const keyring = this.blockchains.get(blockchain);
    if (keyring) {
      return keyring;
    }
    throw new Error(`no keyring for ${blockchain}`);
  }

  /**
   * Returns the keyring for a given public key.
   */
  public keyringForPublicKey(publicKey: string): BlockchainKeyring {
    for (const keyring of this.blockchains.values()) {
      if (keyring.hasPublicKey(publicKey)) {
        return keyring;
      }
    }
    throw new Error(`no keyring for ${publicKey}`);
  }

  /**
   * Returns the blockchain for a given public key.
   */
  public blockchainForPublicKey(publicKey: string): Blockchain {
    for (const [blockchain, keyring] of this.blockchains) {
      if (keyring.hasPublicKey(publicKey)) {
        return blockchain as Blockchain;
      }
    }
    throw new Error(`no blockchain for ${publicKey}`);
  }

  public async activeWallets(): Promise<string[]> {
    return this.blockchainKeyrings()
      .map((blockchain) =>
        this.keyringForBlockchain(blockchain).getActiveWallet()
      )
      .filter((w) => w !== undefined) as string[];
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Actions.
  ///////////////////////////////////////////////////////////////////////////////

  public async blockchainKeyringAdd(
    blockchain: Blockchain,
    walletDescriptor: WalletDescriptor,
    xfp?: string,
    keyringType?: KeyringType
  ): Promise<string> {
    const keyring = keyringForBlockchain(blockchain);
    if (this.mnemonic) {
      // Initialising using a mnemonic
      await keyring.initFromMnemonic(this.mnemonic, [
        walletDescriptor.derivationPath,
      ]);
    } else {
      // Initialising using a hardware wallet
      if (keyringType === 'keystone') {
        if (!xfp) {
          throw new Error(
            "initialising keyring with Keystone wallet requires xfp"
          );
        }
        await keyring.initFromKeystone([walletDescriptor], xfp);
      } else {
        await keyring.initFromLedger([walletDescriptor]);
      }
    }
    this.blockchains.set(blockchain, keyring);
    return walletDescriptor.publicKey;
  }

  public async blockchainKeyringRemove(blockchain: Blockchain): Promise<void> {
    this.blockchains.delete(blockchain);
  }

  public async importSecretKey(
    blockchain: Blockchain,
    secretKey: string,
    name: string
  ): Promise<[string, string]> {
    const keyring = this.keyringForBlockchain(blockchain);
    const [publicKey, _name] = await keyring.importSecretKey(secretKey, name);
    return [publicKey, _name];
  }

  /**
   * Update the active public key for the given blockchain.
   */
  public async activeWalletUpdate(
    newActivePublicKey: string,
    blockchain: Blockchain
  ) {
    const keyring = this.keyringForBlockchain(blockchain);
    await keyring.activeWalletUpdate(newActivePublicKey);

    this.activeBlockchain = blockchain;
  }

  public nextDerivationPath(
    blockchain: Blockchain,
    keyring: "hd" | "ledger"
  ): string {
    let blockchainKeyring = this.blockchains.get(blockchain);
    if (!blockchainKeyring) {
      throw new Error("blockchain keyring not initialised");
    } else {
      return blockchainKeyring.nextDerivationPath(keyring);
    }
  }

  public addDerivationPath(
    blockchain: Blockchain,
    derivationPath: string
  ): Promise<{ publicKey: string; name: string }> {
    let blockchainKeyring = this.blockchains.get(blockchain);
    if (!blockchainKeyring) {
      throw new Error("blockchain keyring not initialised");
    } else {
      return blockchainKeyring.addDerivationPath(derivationPath);
    }
  }

  /**
   * Get the next derived key for the mnemonic.
   */
  public async deriveNextKey(
    blockchain: Blockchain
  ): Promise<{ publicKey: string; derivationPath: string; name: string }> {
    let blockchainKeyring = this.blockchains.get(blockchain);
    if (!blockchainKeyring) {
      throw new Error("blockchain keyring not initialised");
    } else {
      return await blockchainKeyring.deriveNextKey();
    }
  }

  public exportSecretKey(publicKey: string): string {
    const keyring = this.keyringForPublicKey(publicKey);
    return keyring.exportSecretKey(publicKey);
  }

  public exportMnemonic(): string {
    if (!this.mnemonic) throw new Error("keyring does not have a mnemonic");
    return this.mnemonic;
  }

  public async ledgerImport(
    blockchain: Blockchain,
    walletDescriptor: WalletDescriptor
  ) {
    const blockchainKeyring = this.blockchains.get(blockchain);
    const ledgerKeyring = blockchainKeyring!.ledgerKeyring!;
    await ledgerKeyring.add(walletDescriptor);
    const name = DefaultKeyname.defaultLedger(
      ledgerKeyring.publicKeys().length
    );
    await store.setKeyname(walletDescriptor.publicKey, name);
    await store.setIsCold(walletDescriptor.publicKey, true);
  }

  public async keystoneImport(
    blockchain: Blockchain,
    ur: UR,
    pubkey?: string
  ) {
    const blockchainKeyring = this.blockchains.get(blockchain);
    const keystoneKeyring = blockchainKeyring!.keystoneKeyring!;
    await keystoneKeyring.keystoneImport(ur, pubkey);
    if (pubkey) {
      const accounts = keystoneKeyring.getCachedAccounts();
      const i = accounts.findIndex(e => e.publicKey === pubkey);
      if (i > -1) {
        const account = accounts[i];
        const name = DefaultKeyname.defaultKeystone(account.index!);
        await store.setKeyname(account.publicKey, name);
        await store.setIsCold(account.publicKey, false);
      }
    }
    return {
      accounts: keystoneKeyring.getCachedAccounts(),
      xfp: keystoneKeyring.getXFP(),
    };
  }

  public async keyDelete(blockchain: Blockchain, pubkey: string) {
    const blockchainKeyring = this.blockchains.get(blockchain);
    await blockchainKeyring!.keyDelete(pubkey);
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Serialization.
  ///////////////////////////////////////////////////////////////////////////////

  public toJson(): UserKeyringJson {
    // toJson on all the keyrings
    const blockchains = Object.fromEntries(
      [...this.blockchains].map(([k, v]) => [k, v.toJson()])
    );
    return {
      uuid: this.uuid,
      username: this.username,
      activeBlockchain: this.activeBlockchain,
      mnemonic: this.mnemonic,
      blockchains,
    };
  }

  public static fromJson(json: UserKeyringJson): UserKeyring {
    const { uuid, username, activeBlockchain, mnemonic, blockchains } = json;

    const u = new UserKeyring();
    u.uuid = uuid;
    u.username = username;
    u.mnemonic = mnemonic;
    u.blockchains = new Map(
      Object.entries(blockchains).map(([blockchain, obj]) => {
        const blockchainKeyring = keyringForBlockchain(
          blockchain as Blockchain
        );
        blockchainKeyring.fromJson(obj);
        return [blockchain, blockchainKeyring];
      })
    );
    u.activeBlockchain = activeBlockchain ?? Object.keys(blockchains)[0];

    return u;
  }
}
