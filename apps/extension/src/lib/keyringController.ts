import { KeyringController, keyringBuilderFactory, defaultKeyringBuilders } from '@metamask/eth-keyring-controller'
// import bufferPolyfill from '@lit-web3/ethers/src/node.polyfill'
//import { Mutex } from 'await-semaphore';

export let keyringController = new KeyringController({
  keyringBuilders: defaultKeyringBuilders
  //initState: initState.KeyringController,
  //encryptor: {},
})
//keyringController.createVaultMutex = new Mutex()
console.log(keyringController)

enum HardwareKeyringTypes {
  ledger = 'Ledger Hardware',
  trezor = 'Trezor Hardware',
  lattice = 'Lattice Hardware',
  qr = 'QR Hardware Wallet Device',
  hdKeyTree = 'HD Key Tree',
  imported = 'Simple Key Pair'
}

keyringController.on('update', function () {
  console.log('keyring update event')
})

// create new vault
export async function createNewVaultAndKeychain(password: string) {
  // await bufferPolyfill()
  try {
    let vault
    const accounts = await keyringController.getAccounts()
    if (accounts.length > 0) {
      vault = await keyringController.fullUpdate()
    } else {
      vault = await keyringController.createNewVaultAndKeychain(password)
      const addresses = await keyringController.getAccounts()
      console.log('new accounts', addresses)
      //      this.preferencesController.setAddresses(addresses);
      //      this.selectFirstIdentity();
    }
    return vault
  } finally {
    // release lock
  }
}

async function addNewAccount(accountCount: number) {
  const [primaryKeyring] = keyringController.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
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

export async function verifySeedPhrase() {
  const [primaryKeyring] = keyringController.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
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

async function resetAccount() {
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

async function submitPassword(password: string) {
  await keyringController.submitPassword(password)

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

  return keyringController.fullUpdate()
}

async function verifyPassword(password: string) {
  await keyringController.verifyPassword(password)
}

function getPrimaryKeyringMnemonic() {
  const [keyring] = keyringController.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
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
function markPasswordForgotten() {
  //preferencesController.setPasswordForgotten(true);
  //sendUpdate();
}

/**
 * Allows a user to end the seed phrase recovery process.
 */
function unMarkPasswordForgotten() {
  //preferencesController.setPasswordForgotten(false);
  //sendUpdate();
}

createNewVaultAndKeychain('12345678')
