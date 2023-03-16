import { EventEmitter } from 'events'
import { KeyringController, keyringBuilderFactory, defaultKeyringBuilders } from '@metamask/eth-keyring-controller'
import setupAllControllers from '~/lib/controllers'
import setupAllMethods from '~/lib/keyringController.setup/methods'
import { triggerUi, openPopup } from '~/ext.scripts/sw/notificationManager'
import { Mutex } from 'await-semaphore'
import { debounce } from 'lodash'
import * as Connections from './keyringController.setup/connections'
import setupAllMiddlewares from '~/lib/middlewares'
import ComposableObservableStore from './ComposableObservableStore'
import { MetaMaskKeyring as QRHardwareKeyring } from '@keystonehq/metamask-airgapped-keyring'
import swGlobal from '~/ext.scripts/sw/swGlobal'
import DoidNameController from './doidNameController'
import { MILLISECOND } from '@lit-web3/core/src/constants/time'
// import { setupMultiplex } from './stream-utils'
// import createMetaRPCHandler from './createMetaRPCHandler'
import OnboardingController from '~/lib/controllers/onBoarding'
import setupPump from '~/lib/keyringController.setup/setupPump'
import { loadStateFromPersistence } from './keyringController.setup/loadStateFromPersistence'
export const enum HardwareKeyringTypes {
  ledger = 'Ledger Hardware',
  trezor = 'Trezor Hardware',
  lattice = 'Lattice Hardware',
  qr = 'QR Hardware Wallet Device',
  hdKeyTree = 'HD Key Tree',
  imported = 'Simple Key Pair'
}

export class DOIDController extends EventEmitter {
  keyringController: KeyringController
  opts: Record<string, any>
  activeControllerConnections: any
  connections: any
  createVaultMutex: any
  extension: any

  store: ComposableObservableStore
  memStore: ComposableObservableStore

  controllerMessenger: any
  preferencesController: any
  networkController: any
  tokenListController: any

  provider: any
  blockTracker: any
  approvalController: any
  startUISync: boolean = false
  doidNameController: DoidNameController
  sendUpdate: any
  initState: any
  localStoreApiWrapper: any
  onboardingController: OnboardingController
  appStateController: any
  permissionController: any
  accountTracker: any
  _isClientOpen: any

  //store : ComposableObservableStore
  constructor(opts: Record<string, any>) {
    super()
    this.opts = opts
    this.extension = opts.browser ?? chrome

    this.extension.runtime.onMessageExternal.addListener((message: string) => {
      if (message === 'isRunning') console.warn('Warning! You have multiple instances of DOID running!')
    })
    this.sendUpdate = debounce(this.privateSendUpdate.bind(this), MILLISECOND * 200)

    const initState = (this.initState = opts.initState || {})
    this.activeControllerConnections = 0
    this.connections = {}
    this.createVaultMutex = new Mutex()

    let additionalKeyrings = [keyringBuilderFactory(QRHardwareKeyring)]
    this.localStoreApiWrapper = opts.localStore

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
    this.keyringController = new KeyringController({
      keyringBuilders: additionalKeyrings,
      initState: initState.KeyringController,
      encryptor: opts.encryptor || undefined,
      cacheEncryptionKey: true //isManifestV3,
    })

    // Setup all controllers
    setupAllControllers.bind(this)()
    // Setup all methods
    setupAllMethods.bind(this)()
    // Setup all methods
    setupAllMiddlewares.bind(this)()

    this.store = new ComposableObservableStore({
      controllerMessenger: this.controllerMessenger,
      state: initState,
      persist: true
    })

    this.on('update', (memState) => {
      console.log(memState, '000000000')
    })
    // this.keyringController.on('update', () => {
    //   const data = Object.assign(initState, {
    //     KeyringController: this.keyringController.store.getState()
    //   })
    //   localStore.set(data)
    // })
    // this.keyringController.memStore.subscribe((state:any) =>
    //   this._onKeyringControllerUpdate(state),
    // );
    // this.keyringController.on('unlock', () => this._onUnlock());
    // this.keyringController.on('lock', () => this._onLock());

    this.doidNameController = new DoidNameController({
      initState: initState.doidNameController
    })
    this.onboardingController = new OnboardingController({
      initState: initState.OnboardingController
    })

    /**
     * All controllers in Memstore but not in store. They are not persisted.
     * On chrome profile re-start, they will be re-initialized.
     */
    const resetOnRestartStore = {
      AccountTracker: this.accountTracker.store
      //      TxController: this.txController.memStore,
      //      TokenRatesController: this.tokenRatesController,
      //      MessageManager: this.messageManager.memStore,
      //      PersonalMessageManager: this.personalMessageManager.memStore,
      //      DecryptMessageManager: this.decryptMessageManager.memStore,
      //      EncryptionPublicKeyManager: this.encryptionPublicKeyManager.memStore,
      //      TypesMessageManager: this.typedMessageManager.memStore,
      //      SwapsController: this.swapsController.store,
      //      EnsController: this.ensController.store,
      //      ApprovalController: this.approvalController,
    }

    this.store.updateStructure({
      AppStateController: this.appStateController.store,
      //      TransactionController: this.txController.store,
      KeyringController: this.keyringController.store,
      DoidController: this.doidNameController.store,
      PreferencesController: this.preferencesController.store,
      //      MetaMetricsController: this.metaMetricsController.store,
      //      AddressBookController: this.addressBookController,
      //      CurrencyController: this.currencyRateController,
      NetworkController: this.networkController.store,
      //      CachedBalancesController: this.cachedBalancesController.store,
      //      AlertController: this.alertController.store,
      OnboardingController: this.onboardingController.store,
      //      IncomingTransactionsController: this.incomingTransactionsController.store,
      PermissionController: this.permissionController,
      //      PermissionLogController: this.permissionLogController.store,
      //      SubjectMetadataController: this.subjectMetadataController,
      //      BackupController: this.backupController,
      //      AnnouncementController: this.announcementController,
      //      GasFeeController: this.gasFeeController,
      TokenListController: this.tokenListController,
      //      TokensController: this.tokensController,
      //      SmartTransactionsController: this.smartTransactionsController,
      //      NftController: this.nftController,
      //      PhishingController: this.phishingController,
      ...resetOnRestartStore
    })

    this.memStore = new ComposableObservableStore({
      config: {
        AppStateController: this.appStateController.store,
        NetworkController: this.networkController.store,
        //        CachedBalancesController: this.cachedBalancesController.store,
        KeyringController: this.keyringController.memStore,
        DoidController: this.doidNameController.memStore,
        PreferencesController: this.preferencesController.store,
        //        MetaMetricsController: this.metaMetricsController.store,
        //        AddressBookController: this.addressBookController,
        //        CurrencyController: this.currencyRateController,
        //        AlertController: this.alertController.store,
        OnboardingController: this.onboardingController.store,
        //        IncomingTransactionsController:
        //          this.incomingTransactionsController.store,
        PermissionController: this.permissionController,
        //        PermissionLogController: this.permissionLogController.store,
        //        SubjectMetadataController: this.subjectMetadataController,
        //        BackupController: this.backupController,
        //        AnnouncementController: this.announcementController,
        //        GasFeeController: this.gasFeeController,
        TokenListController: this.tokenListController,
        //        TokensController: this.tokensController,
        //        SmartTransactionsController: this.smartTransactionsController,
        //        NftController: this.nftController,
        ...resetOnRestartStore
      },
      controllerMessenger: this.controllerMessenger
    })
  }

  /**
   * Create a new Vault and restore an existent keyring.
   *
   * @param {string} password
   * @param {number[]} encodedSeedPhrase - The seed phrase, encoded as an array
   * of UTF-8 bytes.
   */
  async createNewVaultAndRestore(doidName: string, password: string, encodedSeedPhrase: number[]) {
    //const releaseLock = await this.createVaultMutex.acquire();
    try {
      let accounts, lastBalance

      const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase)

      const { keyringController } = this

      // clear known identities
      this.preferencesController.setAddresses([])

      // clear permissions
      this.permissionController.clearState()

      // clear accounts in accountTracker
      this.accountTracker.clearAccounts()

      // clear cachedBalances
      //this.cachedBalancesController.clearCachedBalances();

      // clear unapproved transactions
      //this.txController.txStateManager.clearUnapprovedTxs();

      // create new vault
      const vault = await keyringController.createNewVaultAndRestore(password, seedPhraseAsBuffer)

      //const ethQuery = new EthQuery(this.provider);
      accounts = await keyringController.getAccounts()
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
      // const transportPreference =
      //  this.preferencesController.getLedgerTransportPreference();
      //this.setLedgerTransportPreference(transportPreference);

      //// set new identities
      //this.preferencesController.setAddresses(accounts);
      //this.selectFirstIdentity();

      if (doidName === null || doidName === '') {
        return
      }
      this.doidNameController.bindName(doidName, accounts[0])

      return vault
    } finally {
      //releaseLock();
    }
  }

  /**
   * Get first address of an seedphrase
   * @param seedPhrase
   * @returns first address of the seed
   */
  async getFirstAccountFromSeedPhrase(seedPhrase: number[]) {
    const keyring = await this.keyringController._newKeyring(HardwareKeyringTypes.hdKeyTree, {
      mnemonic: seedPhrase,
      numberOfAccounts: 1
    })

    const [firstAccount] = await keyring.getAccounts()

    if (!firstAccount) {
      throw new Error('KeyringController - First Account not found.')
    }
    return firstAccount
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
    const { keyringController } = this
    const { identities: oldIdentities } = this.preferencesController.store.getState()

    if (Object.keys(oldIdentities).length === accountCount) {
      const oldAccounts = await keyringController.getAccounts()
      const keyState = await keyringController.addNewAccount(primaryKeyring)
      const newAccounts = await keyringController.getAccounts()

      await this.verifySeedPhrase()

      this.preferencesController.setAddresses(newAccounts)
      newAccounts.forEach((address) => {
        if (!oldAccounts.includes(address)) {
          this.preferencesController.setSelectedAddress(address)
        }
      })

      const { identities } = this.preferencesController.store.getState()
      return { ...keyState, identities }
    }

    return {
      ...keyringController.memStore.getState(),
      identities: oldIdentities
    }
  }
  getState() {
    const { vault } = this.keyringController.store.getState()
    const isInitialized = Boolean(vault)
    return {
      isInitialized,
      ...this.memStore.getFlatState()
    }
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

  // Unlock
  isUnlocked() {
    return this.keyringController.memStore.getState().isUnlocked
  }
  setLocked() {
    const [ledgerKeyring] = this.keyringController.getKeyringsByType(HardwareKeyringTypes.ledger)
    ledgerKeyring?.destroy?.()
    this.clearLoginArtifacts()
    return this.keyringController.setLocked()
  }
  async clearLoginArtifacts() {
    await browser.storage.session.remove(['loginToken', 'loginSalt'])
  }
  // Popup
  set isClientOpen(open: boolean) {
    this._isClientOpen = open
    // this.detectTokensController.isOpen = open;
  }
  onClientClosed() {
    try {
      // this.gasFeeController.stopPolling()
      this.appStateController.clearPollingTokens()
    } catch (error) {
      console.error(error)
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
  removeAllAccountPermissions(targetAccount: string) {
    //  this.permissionController.updatePermissionsByCaveat(
    //    CaveatTypes.restrictReturnedAccounts,
    //    (existingAccounts) =>
    //      CaveatMutatorFactories[
    //        CaveatTypes.restrictReturnedAccounts
    //      ].removeAccount(targetAccount, existingAccounts),
    //  );
  }
  //
  ///**
  // * Removes an account from state / storage.
  // *
  // * @param {string[]} address - A hex address
  // */
  async removeAccount(address: string) {
    // Remove all associated permissions
    this.removeAllAccountPermissions(address)
    // Remove account from the preferences controller
    this.preferencesController.removeAddress(address)
    // Remove account from the account tracker controller
    this.accountTracker.removeAccount([address])
    //
    const keyring = await this.keyringController.getKeyringForAccount(address)
    // Remove account from the keyring
    await this.keyringController.removeAccount(address)
    const updatedKeyringAccounts = keyring ? await keyring.getAccounts() : {}
    if (updatedKeyringAccounts?.length === 0) {
      keyring.destroy?.()
    }
    return address
  }
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
      await this.blockTracker.checkForLatestBlock()
      const allAccounts = await this.keyringController.getAccounts()
    } catch (error) {
      console.error('Error while unlocking extension.', error)
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
  getApi() {
    const { onboardingController } = this
    return {
      getState: this.getState.bind(this),
      markPasswordForgotten: this.markPasswordForgotten.bind(this),
      unMarkPasswordForgotten: this.unMarkPasswordForgotten.bind(this),
      addNewAccount: this.addNewAccount.bind(this),
      verifySeedPhrase: this.verifySeedPhrase.bind(this),
      resetAccount: this.resetAccount.bind(this),
      submitPassword: this.submitPassword.bind(this),
      verifyPassword: this.verifyPassword.bind(this),
      createNewVaultAndKeychain: this.createNewVaultAndKeychain.bind(this),
      createNewVaultAndRestore: this.createNewVaultAndRestore.bind(this),
      setSeedPhraseBackedUp: onboardingController.setSeedPhraseBackedUp.bind(onboardingController),
      // KeyringController
      setLocked: this.setLocked.bind(this),
      // permissions
      // approval controller
      resolvePendingApproval: this.resolvePendingApproval,
      rejectPendingApproval: this.rejectPendingApproval
    }
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
  _startUISync() {
    // Message startUISync is used in MV3 to start syncing state with UI
    // Sending this message after login is completed helps to ensure that incomplete state without
    // account details are not flushed to UI.
    this.emit('startUISync')
    this.startUISync = true
    this.memStore.subscribe(this.sendUpdate.bind(this))
  }
  privateSendUpdate() {
    this.emit('update', this.getState())
  }

  // setupUntrustedCommunication
  setupUntrustedCommunication = Connections.setupUntrustedCommunication.bind(this)
  setupTrustedCommunication = Connections.setupTrustedCommunication.bind(this)
  setupControllerConnection = Connections.setupControllerConnection.bind(this)
  setupProviderConnection = Connections.setupProviderConnection.bind(this)
  addConnection = Connections.addConnection.bind(this)
  removeConnection = Connections.removeConnection.bind(this)
  removeAllConnections = Connections.removeAllConnections.bind(this)
  notifyConnections = Connections.notifyConnections.bind(this)
  notifyAllConnections = Connections.notifyAllConnections.bind(this)
  // _onKeyringControllerUpdate=
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
  swGlobal.controller = new DOIDController({
    initState,
    initLangCode,
    localStore: swGlobal.localStore,
    // deps: notificationManager/appStateController
    ...{ showUserConfirmation: triggerUi, openPopup },
    browser: chrome,
    getRequestAccountTabIds: () => {
      return swGlobal.requestAccountTabIds
    },
    getOpenMetamaskTabsIds: () => {
      return swGlobal.openMetamaskTabsIDs
    }
  })
  // stream error
  setupPump()
  return swGlobal.controller
  //
  // MetaMask Controller
  //
  /*

  setupEnsIpfsResolver({
    getCurrentChainId: controller.networkController.getCurrentChainId.bind(
      controller.networkController,
    ),
    getIpfsGateway: controller.preferencesController.getIpfsGateway.bind(
      controller.preferencesController,
    ),
    provider: controller.provider,
  });

  setupSentryGetStateGlobal(controller);
  */
}

export const getFirstPreferredLangCode = async function () {
  return 'en'
}

export async function initialize() {
  const initState = await loadStateFromPersistence()
  const initLangCode = await getFirstPreferredLangCode()
  const doidController = setupController(initState, initLangCode)

  // test
  //const encodedSeedPhrase = Array.from(
  //  Buffer.from('swear type number garlic physical mean voice island report typical multiply holiday', 'utf8').values()
  //)
  //const encodedSeedPhrase2 = Array.from(
  //  Buffer.from('legal winner thank year wave sausage worth useful legal winner thank yellow', 'utf8').values()
  //)
  //const vault = await doidController.createNewVaultAndRestore('123', encodedSeedPhrase)
  //const secondkeyring = await doidController.keyringController.addNewKeyring(HardwareKeyringTypes.hdKeyTree)
}
export const initController = initialize
initialize() // incorrect entry
