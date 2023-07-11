import MetaMaskOnboarding from './metamask-onboarding'
import { getAddress } from 'ethers'
import { emitErr } from '@lit-web3/core/src/emitter'
import { WalletState, forceRequestUpdate } from '../../wallet'
import detectEthereum, { getChainId, getChainIdSync, getAccounts } from '../../detectEthereum'
import screen from '@lit-web3/core/src/screen'

class MetaMask implements Wallet {
  public onboarding: any
  public state: WalletState
  public provider: any
  public inited: boolean
  public accounts: string[]
  public listeners: any

  constructor(provider: object) {
    this.onboarding = new MetaMaskOnboarding()
    this.provider = provider
    this.accounts = []
    this.inited = false
    this.state = this.updateState()
    this.listeners = new Map()
  }
  updateState(): WalletState {
    return (this.state =
      WalletState[
        MetaMaskOnboarding.isMetaMaskInstalled() ? 'INSTALLED' : this.inited ? 'NOT_INSTALLED' : 'CONNECTING'
      ])
  }
  get account() {
    const [account = ''] = this.accounts
    return account
  }
  updateAccounts(accounts = []) {
    this.accounts = accounts.map((r) => getAddress(r))
    forceRequestUpdate()
  }
  updateProvider(chainId?: string) {
    this.provider.update({ chainId })
    forceRequestUpdate()
  }
  unlisten() {
    const { ethereum } = window
    if (!ethereum) return
    // ethereum.removeAllListeners()
    this.listeners.forEach((fn: Function, evt: string) => ethereum.removeAllListeners(evt, fn))
  }
  onMessage(msg: any) {
    console.info(msg, 'MetaMask onMessage')
  }
  async listen() {
    const { ethereum } = window
    if (!ethereum) return
    this.unlisten()
    this.listeners.set('accountsChanged', this.updateAccounts.bind(this))
    this.listeners.set('connect', this.updateAccounts.bind(this))
    this.listeners.set('disconnect', this.updateAccounts.bind(this))
    this.listeners.set('chainChanged', this.updateProvider.bind(this))
    this.listeners.set('message', this.onMessage.bind(this))
    this.listeners.forEach((fn: Function, evt: string) => ethereum.addListener(evt, fn))
    // Get
    const [chainId, accounts] = (await Promise.all([getChainId(), getAccounts(ethereum)])) || []
    if (chainId) this.updateProvider(chainId)
    if (accounts) this.updateAccounts(accounts)
  }
  disconnect() {
    this.unlisten()
    this.onboarding.stopOnboarding()
    if ([WalletState.CONNECTING, WalletState.INSTALLING].includes(this.state)) this.updateState()
    localStorage.removeItem('metamask.injected')
    this.updateAccounts([])
    this.updateProvider()
  }
  get installText() {
    return `${screen.isMobi ? 'Open in' : 'Install'} MetaMask`
  }
  async install() {
    if (screen.isMobi) location.href = import.meta.env.VITE_APP_METAMASK_DEEPLINK
    else {
      this.state = WalletState.INSTALLING
      this.onboarding.stopOnboarding()
      this.onboarding.startOnboarding()
    }
  }
  async connect() {
    this.inited = true
    const ethereum = await detectEthereum()
    if (!ethereum) this.updateState()
    switch (this.state) {
      case WalletState.CONNECTING:
      case WalletState.INSTALLING:
      case WalletState.NOT_INSTALLED:
        return
    }
    this.disconnect()
    if (!ethereum) return
    localStorage.setItem('metamask.injected', '1')
    this.state = WalletState.CONNECTING
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      this.updateAccounts(accounts)
      this.listen()
      this.state = WalletState.CONNECTED
    } catch (err) {
      emitErr(err)
      this.state = WalletState.DISCONNECTED
      throw err
    } finally {
      this.updateProvider(await getChainId())
    }
  }
}

export default MetaMask
