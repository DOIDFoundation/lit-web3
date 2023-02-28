
class PereferencesController {
  constructor() {
  }
  // PUBLIC METHODS

  /**
   * Sets the {@code forgottenPassword} state property
   *
   * @param {boolean} forgottenPassword - whether or not the user has forgotten their password
   */
  setPasswordForgotten(forgottenPassword) {
    this.store.updateState({ forgottenPassword });
  }

  /**
   * Setter for the `useBlockie` property
   *
   * @param {boolean} val - Whether or not the user prefers blockie indicators
   */
  setUseBlockie(val) {
    this.store.updateState({ useBlockie: val });
  }

  /**
   * Setter for the `useNonceField` property
   *
   * @param {boolean} val - Whether or not the user prefers to set nonce
   */
  setUseNonceField(val) {
    this.store.updateState({ useNonceField: val });
  }

  /**
   * Setter for the `usePhishDetect` property
   *
   * @param {boolean} val - Whether or not the user prefers phishing domain protection
   */
  setUsePhishDetect(val) {
    this.store.updateState({ usePhishDetect: val });
  }

  /**
   * Setter for the `useMultiAccountBalanceChecker` property
   *
   * @param {boolean} val - Whether or not the user prefers to turn off/on all security settings
   */
  setUseMultiAccountBalanceChecker(val) {
    this.store.updateState({ useMultiAccountBalanceChecker: val });
  }

  /**
   * Setter for the `useTokenDetection` property
   *
   * @param {boolean} val - Whether or not the user prefers to use the static token list or dynamic token list from the API
   */
  setUseTokenDetection(val) {
    this.store.updateState({ useTokenDetection: val });
    this.tokenListController.updatePreventPollingOnNetworkRestart(!val);
    if (val) {
      this.tokenListController.start();
    } else {
      this.tokenListController.clearingTokenListData();
      this.tokenListController.stop();
    }
  }

  /**
   * Setter for the `useNftDetection` property
   *
   * @param {boolean} useNftDetection - Whether or not the user prefers to autodetect collectibles.
   */
  setUseNftDetection(useNftDetection) {
    this.store.updateState({ useNftDetection });
  }

  /**
   * Setter for the `useCurrencyRateCheck` property
   *
   * @param {boolean} val - Whether or not the user prefers to use currency rate check for ETH and tokens.
   */
  setUseCurrencyRateCheck(val) {
    this.store.updateState({ useCurrencyRateCheck: val });
  }

  /**
   * Setter for the `openSeaEnabled` property
   *
   * @param {boolean} openSeaEnabled - Whether or not the user prefers to use the OpenSea API for collectibles data.
   */
  setOpenSeaEnabled(openSeaEnabled) {
    this.store.updateState({
      openSeaEnabled,
    });
  }

  /**
   * Setter for the `advancedGasFee` property
   *
   * @param {object} val - holds the maxBaseFee and PriorityFee that the user set as default advanced settings.
   */
  setAdvancedGasFee(val) {
    this.store.updateState({ advancedGasFee: val });
  }

  /**
   * Setter for the `theme` property
   *
   * @param {string} val - 'default' or 'dark' value based on the mode selected by user.
   */
  setTheme(val) {
    this.store.updateState({ theme: val });
  }

  /**
   * Setter for the `transactionSecurityCheckEnabled` property
   *
   * @param transactionSecurityCheckEnabled
   */
  setTransactionSecurityCheckEnabled(transactionSecurityCheckEnabled) {
    this.store.updateState({
      transactionSecurityCheckEnabled,
    });
  }

  /**
   * Add new methodData to state, to avoid requesting this information again through Infura
   *
   * @param {string} fourBytePrefix - Four-byte method signature
   * @param {string} methodData - Corresponding data method
   */
  addKnownMethodData(fourBytePrefix, methodData) {
    const { knownMethodData } = this.store.getState();
    knownMethodData[fourBytePrefix] = methodData;
    this.store.updateState({ knownMethodData });
  }

  /**
   * Setter for the `currentLocale` property
   *
   * @param {string} key - he preferred language locale key
   */
  setCurrentLocale(key) {
    const textDirection = ['ar', 'dv', 'fa', 'he', 'ku'].includes(key)
      ? 'rtl'
      : 'auto';
    this.store.updateState({
      currentLocale: key,
      textDirection,
    });
    return textDirection;
  }
  /**
   * Updates identities to only include specified addresses. Removes identities
   * not included in addresses array
   *
   * @param {string[]} addresses - An array of hex addresses
   */
  setAddresses(addresses) {
    const oldIdentities = this.store.getState().identities;

    const identities = addresses.reduce((ids, address, index) => {
      const oldId = oldIdentities[address] || {};
      ids[address] = { name: `Account ${index + 1}`, address, ...oldId };
      return ids;
    }, {});

    this.store.updateState({ identities });
  }

  /**
   * Removes an address from state
   *
   * @param {string} address - A hex address
   * @returns {string} the address that was removed
   */
  removeAddress(address) {
    const { identities } = this.store.getState();

    if (!identities[address]) {
      throw new Error(`${address} can't be deleted cause it was not found`);
    }
    delete identities[address];
    this.store.updateState({ identities });

    // If the selected account is no longer valid,
    // select an arbitrary other account:
    if (address === this.getSelectedAddress()) {
      const [selected] = Object.keys(identities);
      this.setSelectedAddress(selected);
    }
    return address;
  }

  /**
   * Adds addresses to the identities object without removing identities
   *
   * @param {string[]} addresses - An array of hex addresses
   */
  addAddresses(addresses) {
    const { identities } = this.store.getState();
    addresses.forEach((address) => {
      // skip if already exists
      if (identities[address]) {
        return;
      }
      // add missing identity
      const identityCount = Object.keys(identities).length;

      identities[address] = { name: `Account ${identityCount + 1}`, address };
    });
    this.store.updateState({ identities });
  }

  /**
   * Synchronizes identity entries with known accounts.
   * Removes any unknown identities, and returns the resulting selected address.
   *
   * @param {Array<string>} addresses - known to the vault.
   * @returns {Promise<string>} selectedAddress the selected address.
   */
  syncAddresses(addresses) {
    if (!Array.isArray(addresses) || addresses.length === 0) {
      throw new Error('Expected non-empty array of addresses. Error #11201');
    }

    const { identities, lostIdentities } = this.store.getState();

    const newlyLost = {};
    Object.keys(identities).forEach((identity) => {
      if (!addresses.includes(identity)) {
        newlyLost[identity] = identities[identity];
        delete identities[identity];
      }
    });

    // Identities are no longer present.
    if (Object.keys(newlyLost).length > 0) {
      // store lost accounts
      Object.keys(newlyLost).forEach((key) => {
        lostIdentities[key] = newlyLost[key];
      });
    }

    this.store.updateState({ identities, lostIdentities });
    this.addAddresses(addresses);

    // If the selected account is no longer valid,
    // select an arbitrary other account:
    let selected = this.getSelectedAddress();
    if (!addresses.includes(selected)) {
      [selected] = addresses;
      this.setSelectedAddress(selected);
    }

    return selected;
  }

  /**
   * Setter for the `selectedAddress` property
   *
   * @param {string} _address - A new hex address for an account
   */
  setSelectedAddress(_address) {
    const address = normalizeAddress(_address);

    const { identities } = this.store.getState();
    const selectedIdentity = identities[address];
    if (!selectedIdentity) {
      throw new Error(`Identity for '${address} not found`);
    }

    selectedIdentity.lastSelected = Date.now();
    this.store.updateState({ identities, selectedAddress: address });
  }

  /**
   * Getter for the `selectedAddress` property
   *
   * @returns {string} The hex address for the currently selected account
   */
  getSelectedAddress() {
    return this.store.getState().selectedAddress;
  }

  /**
   * Sets a custom label for an account
   *
   * @param {string} account - the account to set a label for
   * @param {string} label - the custom label for the account
   * @returns {Promise<string>}
   */
  async setAccountLabel(account, label) {
    if (!account) {
      throw new Error(
        `setAccountLabel requires a valid address, got ${String(account)}`,
      );
    }
    const address = normalizeAddress(account);
    const { identities } = this.store.getState();
    identities[address] = identities[address] || {};
    identities[address].name = label;
    this.store.updateState({ identities });
    return label;
  }
  
}
export let preferencesController = new PereferencesController()

