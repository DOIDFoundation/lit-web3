import { EventEmitter } from 'events'
import { KeyringController, keyringBuilderFactory, defaultKeyringBuilders } from '@metamask/eth-keyring-controller'
import LocalStore from './local-store'
//import { Mutex } from 'await-semaphore';

export let doidController: DoidController

enum HardwareKeyringTypes {
  ledger = 'Ledger Hardware',
  trezor = 'Trezor Hardware',
  lattice = 'Lattice Hardware',
  qr = 'QR Hardware Wallet Device',
  hdKeyTree = 'HD Key Tree',
  imported = 'Simple Key Pair'
}

class DoidController extends EventEmitter {
  keyringController: KeyringController
  //store : ComposableObservableStore
  constructor(opts: any) {
    super()
    const initState = opts.initState || {}

    let additionalKeyrings: any = [defaultKeyringBuilders]
    //let additionalKeyrings = [keyringBuilderFactory(QRHardwareKeyring)];

    //if (this.canUseHardwareWallets()) {
    //  const additionalKeyringTypes = [
    //    TrezorKeyring,
    //    LedgerBridgeKeyring,
    //    LatticeKeyring,
    //    QRHardwareKeyring,
    //  ];
    //  additionalKeyrings = additionalKeyringTypes.map((keyringType) =>
    //    keyringBuilderFactory(keyringType),
    //  );
    //}
    console.log(initState)
    this.keyringController = new KeyringController({
      //keyringBuilders: additionalKeyrings,
      initState: initState.KeyringController
      //encryptor: opts.encryptor || undefined,
      //cacheEncryptionKey: isManifestV3,
    })
    //this.store = new ComposableObservableStore({
    //  state: initState,
    //  controllerMessenger: this.controllerMessenger,
    //  persist: true,
    //});

    this.keyringController.on('update', function () {
      console.log('keyring update event')
    })
  }

  //keyringController.createVaultMutex = new Mutex()

  /**
   * Create a new Vault and restore an existent keyring.
   *
   * @param {string} password
   * @param {number[]} encodedSeedPhrase - The seed phrase, encoded as an array
   * of UTF-8 bytes.
   */
  async createNewVaultAndRestore(password: string, encodedSeedPhrase: number[]) {
    //const releaseLock = await createVaultMutex.acquire();
    try {
      let accounts, lastBalance

      const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase)

      //const { keyringController } = this;

      // clear known identities
      //this.preferencesController.setAddresses([]);

      // clear permissions
      //this.permissionController.clearState();

      ///: BEGIN:ONLY_INCLUDE_IN(flask)
      // Clear snap state
      //this.snapController.clearState();
      // Clear notification state
      //this.notificationController.clear();
      ///: END:ONLY_INCLUDE_IN

      // clear accounts in accountTracker
      //this.accountTracker.clearAccounts();

      // clear cachedBalances
      //this.cachedBalancesController.clearCachedBalances();

      // clear unapproved transactions
      //this.txController.txStateManager.clearUnapprovedTxs();

      // create new vault
      const vault = await this.keyringController.createNewVaultAndRestore(password, seedPhraseAsBuffer)

      //const ethQuery = new EthQuery(this.provider);
      //accounts = await keyringController.getAccounts();
      //lastBalance = await this.getBalance(
      //  accounts[accounts.length - 1],
      //  ethQuery,
      //);

      const [primaryKeyring] = this.keyringController.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
      if (!primaryKeyring) {
        throw new Error('MetamaskController - No HD Key Tree found')
      }

      // seek out the first zero balance
      //while (lastBalance !== '0x0') {
      //  await keyringController.addNewAccount(primaryKeyring);
      //  accounts = await keyringController.getAccounts();
      //  lastBalance = await this.getBalance(
      //    accounts[accounts.length - 1],
      //    ethQuery,
      //  );
      //}

      // remove extra zero balance account potentially created from seeking ahead
      //if (accounts.length > 1 && lastBalance === '0x0') {
      //  await this.removeAccount(accounts[accounts.length - 1]);
      //  accounts = await keyringController.getAccounts();
      //}

      //// This must be set as soon as possible to communicate to the
      //// keyring's iframe and have the setting initialized properly
      //// Optimistically called to not block MetaMask login due to
      //// Ledger Keyring GitHub downtime
      //const transportPreference =
      //  this.preferencesController.getLedgerTransportPreference();
      //this.setLedgerTransportPreference(transportPreference);

      //// set new identities
      //this.preferencesController.setAddresses(accounts);
      //this.selectFirstIdentity();
      return vault
    } finally {
      //releaseLock();
    }
  }

  // create new vault
  async createNewVaultAndKeychain(password: string) {
    // await bufferPolyfill()
    try {
      let vault
      const accounts = await this.keyringController.getAccounts()
      if (accounts.length > 0) {
        vault = await this.keyringController.fullUpdate()
      } else {
        vault = await this.keyringController.createNewVaultAndKeychain(password)
        const addresses = await this.keyringController.getAccounts()
        console.log('new accounts', addresses)
        //      this.preferencesController.setAddresses(addresses);
        //      this.selectFirstIdentity();
      }
      return vault
    } finally {
      // release lock
    }
  }

  async addNewAccount(accountCount: number) {
    const [primaryKeyring] = this.keyringController.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
    if (!primaryKeyring) {
      throw new Error('MetamaskController - No HD Key Tree found')
    }
    //  const { identities: oldIdentities } =
    //    this.preferencesController.store.getState();
    //
    //  if (Object.keys(oldIdentities).length === accountCount) {
    //    const oldAccounts = await keyringController.getAccounts();
    //    const keyState = await keyringController.addNewAccount(primaryKeyring);
    //    const newAccounts = await keyringController.getAccounts();
    //
    //    await this.verifySeedPhrase();
    //
    //    this.preferencesController.setAddresses(newAccounts);
    //    newAccounts.forEach((address) => {
    //      if (!oldAccounts.includes(address)) {
    //        this.preferencesController.setSelectedAddress(address);
    //      }
    //    });
    //
    //    const { identities } = this.preferencesController.store.getState();
    //    return { ...keyState, identities };
    //  }
    //
    //  return {
    //    ...keyringController.memStore.getState(),
    //    identities: oldIdentities,
    //  };
  }

  async verifySeedPhrase() {
    const [primaryKeyring] = this.keyringController.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
    if (!primaryKeyring) {
      throw new Error('MetamaskController - No HD Key Tree found')
    }

    const serialized = await primaryKeyring.serialize()
    const seedPhraseAsBuffer = Buffer.from(serialized.mnemonic)

    const accounts = await primaryKeyring.getAccounts()
    if (accounts.length < 1) {
      throw new Error('MetamaskController - No accounts found')
    }

    try {
      //await seedPhraseVerifier.verifyAccounts(accounts, seedPhraseAsBuffer);
      const encodedSeedPhrase = Array.from(seedPhraseAsBuffer.values())
      return Buffer.from(encodedSeedPhrase).toString('utf8')
    } catch (err) {
      //log.error(err.message);
      throw err
    }
  }

  async resetAccount() {
    //const selectedAddress = this.preferencesController.getSelectedAddress();
    //this.txController.wipeTransactions(selectedAddress);
    //this.networkController.resetConnection();
    //return selectedAddress;
  }

  ///**
  // * Gets the permitted accounts for the specified origin. Returns an empty
  // * array if no accounts are permitted.
  // *
  // * @param {string} origin - The origin whose exposed accounts to retrieve.
  // * @param {boolean} [suppressUnauthorizedError] - Suppresses the unauthorized error.
  // * @returns {Promise<string[]>} The origin's permitted accounts, or an empty
  // * array.
  // */
  //async function getPermittedAccounts(
  //  origin,
  //  { suppressUnauthorizedError = true } = {},
  //) {
  //  try {
  //    return await this.permissionController.executeRestrictedMethod(
  //      origin,
  //      RestrictedMethods.eth_accounts,
  //    );
  //  } catch (error) {
  //    if (
  //      suppressUnauthorizedError &&
  //      error.code === rpcErrorCodes.provider.unauthorized
  //    ) {
  //      return [];
  //    }
  //    throw error;
  //  }
  //}
  //
  ///**
  // * Stops exposing the account with the specified address to all third parties.
  // * Exposed accounts are stored in caveats of the eth_accounts permission. This
  // * method uses `PermissionController.updatePermissionsByCaveat` to
  // * remove the specified address from every eth_accounts permission. If a
  // * permission only included this address, the permission is revoked entirely.
  // *
  // * @param {string} targetAccount - The address of the account to stop exposing
  // * to third parties.
  // */
  //function removeAllAccountPermissions(targetAccount) {
  //  this.permissionController.updatePermissionsByCaveat(
  //    CaveatTypes.restrictReturnedAccounts,
  //    (existingAccounts) =>
  //      CaveatMutatorFactories[
  //        CaveatTypes.restrictReturnedAccounts
  //      ].removeAccount(targetAccount, existingAccounts),
  //  );
  //}
  //
  ///**
  // * Removes an account from state / storage.
  // *
  // * @param {string[]} address - A hex address
  // */
  //async function removeAccount(address) {
  //  // Remove all associated permissions
  //  this.removeAllAccountPermissions(address);
  //  // Remove account from the preferences controller
  //  this.preferencesController.removeAddress(address);
  //  // Remove account from the account tracker controller
  //  this.accountTracker.removeAccount([address]);
  //
  //  const keyring = await this.keyringController.getKeyringForAccount(address);
  //  // Remove account from the keyring
  //  await this.keyringController.removeAccount(address);
  //  const updatedKeyringAccounts = keyring ? await keyring.getAccounts() : {};
  //  if (updatedKeyringAccounts?.length === 0) {
  //    keyring.destroy?.();
  //  }
  //
  //  return address;
  //}
  //
  ///**
  // * Imports an account with the specified import strategy.
  // * These are defined in app/scripts/account-import-strategies
  // * Each strategy represents a different way of serializing an Ethereum key pair.
  // *
  // * @param {string} strategy - A unique identifier for an account import strategy.
  // * @param {any} args - The data required by that strategy to import an account.
  // */
  //async function importAccountWithStrategy(strategy, args) {
  //  const privateKey = await accountImporter.importAccount(strategy, args);
  //  const keyring = await this.keyringController.addNewKeyring(
  //    HardwareKeyringTypes.imported,
  //    [privateKey],
  //  );
  //  const [firstAccount] = await keyring.getAccounts();
  //  // update accounts in preferences controller
  //  const allAccounts = await this.keyringController.getAccounts();
  //  this.preferencesController.setAddresses(allAccounts);
  //  // set new account as selected
  //  this.preferencesController.setSelectedAddress(firstAccount);
  //}

  async submitPassword(password: string) {
    await this.keyringController.submitPassword(password)

    try {
      //await this.blockTracker.checkForLatestBlock();
    } catch (error) {
      //log.error('Error while unlocking extension.', error);
    }

    // This must be set as soon as possible to communicate to the
    // keyring's iframe and have the setting initialized properly
    // Optimistically called to not block MetaMask login due to
    // Ledger Keyring GitHub downtime
    //const transportPreference =
    //  this.preferencesController.getLedgerTransportPreference();

    //this.setLedgerTransportPreference(transportPreference);

    return this.keyringController.fullUpdate()
  }

  async verifyPassword(password: string) {
    await this.keyringController.verifyPassword(password)
  }

  getPrimaryKeyringMnemonic() {
    const [keyring] = this.keyringController.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
    if (!keyring.mnemonic) {
      throw new Error('Primary keyring mnemonic unavailable.')
    }

    return keyring.mnemonic
  }

  //=============================================================================
  // PASSWORD MANAGEMENT
  //=============================================================================

  /**
   * Allows a user to begin the seed phrase recovery process.
   */
  markPasswordForgotten() {
    //preferencesController.setPasswordForgotten(true);
    //sendUpdate();
  }

  /**
   * Allows a user to end the seed phrase recovery process.
   */
  unMarkPasswordForgotten() {
    //preferencesController.setPasswordForgotten(false);
    //sendUpdate();
  }
}

const initialState = {
  config: {},
  PreferencesController: {
    frequentRpcListDetail: [
      {
        rpcUrl: 'http://localhost:8545',
        chainId: '0x539',
        ticker: 'ETH',
        nickname: 'Localhost 8545',
        rpcPrefs: {}
      }
    ]
  }
}

class Migrator {
  //extends EventEmitter {
  defaultVersion
  constructor() {
    //super()
    this.defaultVersion = 0

    //const migrations = opts.migrations || [];
    //// sort migrations by version
    //this.migrations = migrations.sort((a, b) => a.version - b.version);
    //// grab migration with highest version
    //const lastMigration = this.migrations.slice(-1)[0];
    //// use specified defaultVersion or highest migration version
    //this.defaultVersion =
    //  opts.defaultVersion || (lastMigration && lastMigration.version) || 0;
  }
  /**
   * Returns the initial state for the migrator
   *
   * @param {object} [data] - The data for the initial state
   * @returns {{meta: {version: number}, data: any}}
   */
  generateInitialState(data: any) {
    return {
      meta: {
        version: this.defaultVersion
      },
      data
    }
  }
}

let versionedData
const inTest = process.env.IN_TEST
//const localStore = inTest ? new ReadOnlyNetworkStore() : new LocalStore();
const localStore = new LocalStore()

async function loadStateFromPersistence() {
  // migrations
  const migrator = new Migrator()
  //  migrator.on('error', console.warn);
  //
  // read from disk
  // first from preferred, async API:
  versionedData = (await localStore.get()) || migrator.generateInitialState(initialState)
  console.log(versionedData)
  //
  //  // check if somehow state is empty
  //  // this should never happen but new error reporting suggests that it has
  //  // for a small number of users
  //  // https://github.com/metamask/metamask-extension/issues/3919
  //  if (versionedData && !versionedData.data) {
  //    // unable to recover, clear state
  //    versionedData = migrator.generateInitialState(firstTimeState);
  //    sentry.captureMessage('MetaMask - Empty vault found - unable to recover');
  //  }
  //
  //  // report migration errors to sentry
  //  migrator.on('error', (err) => {
  //    // get vault structure without secrets
  //    const vaultStructure = getObjStructure(versionedData);
  //    sentry.captureException(err, {
  //      // "extra" key is required by Sentry
  //      extra: { vaultStructure },
  //    });
  //  });
  //
  //  // migrate data
  //  versionedData = await migrator.migrateData(versionedData);
  //  if (!versionedData) {
  //    throw new Error('MetaMask - migrator returned undefined');
  //  }
  // this initializes the meta/version data as a class variable to be used for future writes
  localStore.setMetadata(versionedData.meta)

  // write to disk
  localStore.set(versionedData.data)

  // return just the data
  return versionedData.data
}

/**
 * Initializes the MetaMask Controller with any initial state and default language.
 * Configures platform-specific error reporting strategy.
 * Streams emitted state updates to platform-specific storage strategy.
 * Creates platform listeners for new Dapps/Contexts, and sets up their data connections to the controller.
 *
 * @param {object} initState - The initial state to start the controller with, matches the state that is emitted from the controller.
 * @param {string} initLangCode - The region code for the language preferred by the current user.
 */
function setupController(initState: any, initLangCode: string) {
  doidController = new DoidController({
    initState,
    initLangCode
  })
  return doidController
  //
  // MetaMask Controller
  //
  /*
  controller = new DoidController({
    infuraProjectId: process.env.INFURA_PROJECT_ID,
    // User confirmation callbacks:
    showUserConfirmation: triggerUi,
    openPopup,
    // initial state
    initState,
    // initial locale code
    initLangCode,
    // platform specific api
    platform,
    notificationManager,
    browser,
    getRequestAccountTabIds: () => {
      return requestAccountTabIds;
    },
    getOpenMetamaskTabsIds: () => {
      return openMetamaskTabsIDs;
    },
    localStore,
  });

  setupEnsIpfsResolver({
    getCurrentChainId: controller.networkController.getCurrentChainId.bind(
      controller.networkController,
    ),
    getIpfsGateway: controller.preferencesController.getIpfsGateway.bind(
      controller.preferencesController,
    ),
    provider: controller.provider,
  });

  // setup state persistence
  pump(
    storeAsStream(controller.store),
    debounce(1000),
    createStreamSink((state) => localStore.set(state)),
    (error) => {
      log.error('MetaMask - Persistence pipeline failed', error);
    },
  );

  setupSentryGetStateGlobal(controller);

  const isClientOpenStatus = () => {
    return (
      popupIsOpen ||
      Boolean(Object.keys(openMetamaskTabsIDs).length) ||
      notificationIsOpen
    );
  };
  

  const onCloseEnvironmentInstances = (isClientOpen, environmentType) => {
    // if all instances of metamask are closed we call a method on the controller to stop gasFeeController polling
    if (isClientOpen === false) {
      controller.onClientClosed();
      // otherwise we want to only remove the polling tokens for the environment type that has closed
    } else {
      // in the case of fullscreen environment a user might have multiple tabs open so we don't want to disconnect all of
      // its corresponding polling tokens unless all tabs are closed.
      if (
        environmentType === ENVIRONMENT_TYPE_FULLSCREEN &&
        Boolean(Object.keys(openMetamaskTabsIDs).length)
      ) {
        return;
      }
      controller.onEnvironmentTypeClosed(environmentType);
    }
  };
  */
}

async function getFirstPreferredLangCode() {
  return 'en'
}

export async function initialize() {
  //try {
  const initState = await loadStateFromPersistence()
  const initLangCode = await getFirstPreferredLangCode()
  setupController(initState, initLangCode)
  //if (!isManifestV3) {
  //  await loadPhishingWarningPage();
  //}
  //await sendReadyMessageToTabs();
  //log.info('MetaMask initialization complete.');
  //resolveInitialization();
  //} catch (error) {
  //rejectInitialization(error);
  //  console.error(error)
  //}
}
await initialize()
