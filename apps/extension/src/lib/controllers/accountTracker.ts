/* Account Tracker
 *
 * This module is responsible for tracking any number of accounts
 * and caching their current balances & transaction counts.
 *
 * It also tracks transaction hashes, and checks their inclusion status
 * on each new block.
 */
import { ObservableStore } from '@metamask/obs-store'
import { Web3Provider } from '@ethersproject/providers'
import { NETWORK_TYPES } from '~/constants/network'

export function previousValueComparator<A>(comparator: (previous: A, next: A) => boolean, initialValue: A) {
  let first = true
  let cache: A
  return (value: A) => {
    try {
      if (first) {
        first = false
        return comparator(initialValue ?? value, value)
      }
      return comparator(cache, value)
    } finally {
      cache = value
    }
  }
}

export default class AccountTracker {
  store: any
  resetState: any
  _provider: any
  getCurrentChainId: any
  getNetworkIdentifier: any
  preferencesController: any
  onboardingController: any
  ethersProvider: any
  constructor(opts = <Record<string, any>>{}) {
    const initState = {
      accounts: {},
      currentBlockGasLimit: ''
    }
    this.store = new ObservableStore(initState)

    this.resetState = () => {
      this.store.updateState(initState)
    }

    this._provider = opts.provider

    this.getCurrentChainId = opts.getCurrentChainId
    this.getNetworkIdentifier = opts.getNetworkIdentifier
    this.preferencesController = opts.preferencesController
    this.onboardingController = opts.onboardingController

    this.onboardingController.store.subscribe(
      previousValueComparator(async (prevState, currState) => {
        // const { completedOnboarding: prevCompletedOnboarding } = prevState
        // const { completedOnboarding: currCompletedOnboarding } = currState
        // if (!prevCompletedOnboarding && currCompletedOnboarding) {
        //   this._updateAccounts()
        // }
      }, this.onboardingController.store.getState())
    )

    this.preferencesController.store.subscribe(
      previousValueComparator(async (prevState, currState) => {
        // const { selectedAddress: prevSelectedAddress } = prevState
        // const { selectedAddress: currSelectedAddress, useMultiAccountBalanceChecker } = currState
        // if (prevSelectedAddress !== currSelectedAddress && !useMultiAccountBalanceChecker) {
        //   this._updateAccounts()
        // }
      }, this.onboardingController.store.getState())
    )
    this.ethersProvider = new Web3Provider(this._provider)
  }

  start() {
    this._updateAccounts()
  }

  stop() {}
  syncWithAddresses(addresses) {}

  addAccounts(addresses) {}

  removeAccount(addresses) {}

  clearAccounts() {}

  async _updateForBlock(blockNumber) {}

  async _updateAccounts() {}

  async _updateAccount(address) {}

  async _updateAccountsViaBalanceChecker(addresses, deployedContractAddress) {}
}

export const setupAccountTracker = function () {
  return new AccountTracker({
    provider: this.provider,
    blockTracker: this.blockTracker,
    getCurrentChainId: () => this.networkController.store.getState().provider.chainId,
    getNetworkIdentifier: () => {
      const { type, rpcUrl } = this.networkController.store.getState().provider
      return type === NETWORK_TYPES.RPC ? rpcUrl : type
    },
    preferencesController: this.preferencesController,
    onboardingController: this.onboardingController
  })
}
