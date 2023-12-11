import MetaMaskOnboarding from './metamask-onboarding'
import { getAddress } from 'ethers'
import { emitErr } from '@lit-web3/core/src/emitter'
import { WalletState, emitWalletChange } from '../../wallet'
import detectEthereum, { getChainId, getChainIdSync, getAccounts } from '../../detectEthereum'
import screen from '@lit-web3/core/src/screen'

class DOID implements Wallet {
  public state: WalletState
  public accounts: string[]

  constructor(provider?: object) {
    this.accounts = []
    this.state = this.resetState()
  }

  resetState(): WalletState {
    let state: keyof typeof WalletState = 'CONNECTING'
    return (this.state = WalletState[state])
  }

  get account() {
    return this.accounts[0] ?? ''
  }

  updateProvider(chainId?: string) {
    // this.provider.update({ chainId })
    emitWalletChange()
  }

  async connect() {}
  async disconnect() {}
  async install() {}
}

export default DOID
