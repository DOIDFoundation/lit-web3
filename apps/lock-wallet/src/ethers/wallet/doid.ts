import { Wallet, WalletState, emitWalletChange } from '../wallet'
import { State, property } from '../state'
import { JsonRpcApiProvider, JsonRpcSigner } from 'ethers'
import { chainIdStr } from '../constants/networks'
import { Chain, defineChain } from 'viem'
import { mainnet, bsc } from 'viem/chains'

export { type Chain, defineChain } from 'viem'

const ETH: Chain = defineChain({
  ...mainnet,
  contracts: {
    ...mainnet.contracts,
  }
})
const BSC: Chain = defineChain({
  ...bsc,
  contracts: {
    ...bsc.contracts,
  }
})
const injectedKey = 'doid-connect.injected'

export class DoidWallet extends State implements Wallet {
  public inited = false
  constructor() {
    super()
    this.init()
  }
  private connector: any
  resolved = false
  private async init() {
    let { doid, doidTestnet, DOIDConnectorEthers } = await import('@doid/connect-ethers')
    this.connector = new DOIDConnectorEthers()
    console.log(this.connector, 'this.connector')
    this.connector.updateChains([doid, doidTestnet, ETH, BSC])
    this.connector.updateOptions({
      themeMode: 'dark',
      web3AuthEnabled: true,
      walletConnectEnabled: true,
      walletConnectId: 'b9850e108fc2d1e587dd41ce1fea0a16'
    })
    if (import.meta.env.MODE !== 'production') {
      this.connector.updateOptions({
        web3AuthClientId: 'BNJiGOMfJH5myW47e6KudQGuWPYMBAyu4i7S5ZuEWiam2qDhokXmn0lmsfL9J4RZcT7W2epBrc8EEtUg2J_ACbM'
      })
    }
    this.account = this.connector.account
    this.connector.subscribe((_: any, value: any) => {
      this.account = value
    }, 'account')
    this.doid = this.connector.doid
    this.connector.subscribe((_: any, value: any) => {
      this.doid = value
    }, 'doid')
    if (this.connector.chainId) this.chainId = chainIdStr(this.connector.chainId)
    this.connector.subscribe((_: any, value: number | undefined) => {
      if (!value) return
      this.chainId = value ? chainIdStr(value) : ''
      this.doid = this.connector.doid ?? ''
      if (value == doid.id) this.connector.updateOptions({ doidNetwork: doid })
      else if (value == doidTestnet.id) this.connector.updateOptions({ doidNetwork: doidTestnet })
      this.updateProvider(this.chainId)
    }, 'chainId')
    this.resolved = true
  }

  //-- Wallet interface implementation --
  @property() public state: WalletState = WalletState.DISCONNECTED
  @property() public account = ''
  @property() public chainId: string = ''
  @property() public doid: string = ''

  getAddresses(): Promise<string[]> {
    return this.connector.getAddresses()
  }

  getProvider(): Promise<JsonRpcApiProvider> {
    return this.connector?.getProvider()
  }

  getSigner(account: string): Promise<JsonRpcSigner> {
    return this.connector?.getSigner(this.chainId, account)
  }

  switchChain = (chainId: string) => this.connector.switchChain(Number(chainId))
  updateProvider(chainId: string) {
    emitWalletChange()
  }
  async connect({ force = false } = {}) {
    this.inited = true
    this.state = WalletState.CONNECTING
    try {
      await this.connector.connect({ noModal: !force })
      localStorage.setItem(injectedKey, '1')
    } catch (err: any) {
      this.state = WalletState.DISCONNECTED
      console.info('Connect failed')
      console.info(err)
    } finally {
    }
  }
  async disconnect() {
    await this.connector.disconnect()
    localStorage.removeItem(injectedKey)
    this.state = WalletState.DISCONNECTED
    emitWalletChange()
  }
  install() { }

  ensure = () => {
    return new Promise((resolve) => {
      if (this.resolved) resolve(this)
      const resolver = () => {
        this.resolved = true
        resolve(this)
      }
      let retryTimes = 0
      const detectChainId = async () => {
        if (this.chainId) resolver()
        else if (retryTimes++ < 30) setTimeout(detectChainId, 10)
        else resolver()
      }
      detectChainId()
    })
  }
  injected = () => !!localStorage.getItem(injectedKey)
}

export const importer = {
  name: 'DOID',
  title: 'DOID',
  icon: '',
  app: undefined,
  import: async () => new DoidWallet().ensure()
}
