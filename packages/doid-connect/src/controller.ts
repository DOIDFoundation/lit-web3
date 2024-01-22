import {
  Connector,
  ConnectorData as WagmiConnectorData,
  InjectedConnector,
  WalletClient,
  SwitchChainNotSupportedError,
  ConnectorNotFoundError
} from '@wagmi/core'
import { options } from './options'
import { State, property, storage } from '@lit-web3/base/state'
import {
  Address,
  CallParameters,
  Chain,
  EIP1193Provider,
  PublicClient,
  createPublicClient,
  getContract,
  hexToString,
  http,
  namehash,
  parseAbi
} from 'viem'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { LOGIN_PROVIDER_TYPE, OpenloginAdapter } from '@web3auth/openlogin-adapter'

export type ConnectorState = WagmiConnectorData & {
  doid?: string
}

export class ErrNotRegistered extends Error {
  public readonly account: Address
  constructor(message: string, account: Address, options?: ErrorOptions) {
    super(message, options)
    this.account = account
  }
}

const metamask = 'metaMask'
const coinbase = 'coinbaseWallet'
const walletConnect = 'walletConnect'

export class Controller extends State {
  @property() private connector?: Connector
  /** a list of addresses accessible */
  @property() public addresses?: Address[]
  /** connected account. */
  @property() public account?: Address
  /** chain id of connected connector */
  @property() public chainId?: Chain['id']
  /** DOID name of connected account. */
  @property() public doid?: string
  @storage({ key: 'doid_last_connector' })
  @property()
  private lastConnector?: string

  private static doidClient: PublicClient

  constructor() {
    super()
    this.updateDoidClient()
  }

  public updateDoidClient() {
    Controller.doidClient = createPublicClient({
      chain: options.doidNetwork,
      transport: http()
    })
  }

  protected buildConnector(type?: string): Connector {
    switch (type) {
      case metamask:
        return new MetaMaskConnector({ chains: options.chains })
      case coinbase:
        return new CoinbaseWalletConnector({ chains: options.chains, options: { appName: options.appName ?? 'DOID' } })
      case walletConnect:
        return new WalletConnectConnector({
          chains: options.chains,
          options: {
            projectId: options.walletConnectId!
          }
        })
      default:
        if (type && type != 'injected') {
          if (options.web3AuthEnabled && type in options.web3AuthProviders!) {
            return this.web3AuthConnector(type as LOGIN_PROVIDER_TYPE)
          }
          console.warn(`Unsupported connector type: ${type}`)
        }
        const connector = new InjectedConnector({ chains: options.chains })
        if (!connector.ready) {
          return new CoinbaseWalletConnector({
            chains: options.chains,
            options: { appName: options.appName ?? 'DOID' }
          })
        }
        return connector
    }
  }

  public availableConnectors() {
    let connectors: Connector[] = [this.buildConnector(metamask), this.buildConnector(coinbase)].filter(
      (wallet) => wallet.ready
    )
    let injected = this.buildConnector()
    if (injected.ready && connectors.findIndex((wallet) => wallet.name == injected.name) < 0) {
      connectors.push(injected)
    }
    if (options.walletConnectEnabled) {
      let wc = this.buildConnector(walletConnect)
      if (wc.ready) connectors.push(wc)
    }
    return connectors
  }

  private static web3authInstance: Web3AuthNoModal
  public web3AuthConnector(provider: LOGIN_PROVIDER_TYPE) {
    if (!Controller.web3authInstance) {
      if (options.web3AuthEnabled && !options.web3AuthClientId) {
        throw new Error('Web3Auth Client ID is not configured.')
      }

      let chains = options.chains!
      let chain = this.chainId ? chains.find((c) => c.id == this.chainId) : chains[0]
      if (!chain)
        throw new Error(
          this.chainId ? `chain ${this.chainId} not found in options.chains` : 'options.chains is not configured.'
        )
      const chainConfig = {
        chainId: '0x' + chain.id.toString(16),
        rpcTarget: chain.rpcUrls.default.http[0],
        displayName: chain.name,
        tickerName: chain.nativeCurrency?.name,
        ticker: chain.nativeCurrency?.symbol,
        blockExplorer: chain.blockExplorers?.default?.url ?? ''
      }
      let web3auth = new Web3AuthNoModal({
        clientId: options.web3AuthClientId!,
        web3AuthNetwork: options.web3AuthNetwork,
        chainConfig: { ...chainConfig, chainNamespace: CHAIN_NAMESPACES.EIP155 }
      })
      Controller.web3authInstance = web3auth

      web3auth.configureAdapter(
        new OpenloginAdapter({
          privateKeyProvider: new EthereumPrivateKeyProvider({
            config: { chainConfig }
          }),
          adapterSettings: {
            loginConfig: {
              twitter: {
                verifier: 'doid-auth0',
                typeOfLogin: 'jwt',
                verifierSubIdentifier: 'twitter',
                clientId: 'R2WBTkKbr25H373Xapi38hyl9AsOgbsI',
                jwtParameters: {
                  domain: 'https://dev-jr45ovxdmdpgxydm.us.auth0.com'
                }
              }
            }
          }
        })
      )
    }

    return new Web3AuthConnector({
      chains: options.chains,
      options: {
        web3AuthInstance: Controller.web3authInstance,
        loginParams: {
          loginProvider: provider
        }
      }
    })
  }

  /** @returns is connector usable. */
  get ready(): boolean {
    return (this.connector && this.connector?.ready) ?? false
  }

  /** @returns connected with a valid DOID. */
  get connected(): boolean {
    return Boolean(this.doid)
  }

  protected get doidContractAddress(): Address {
    return Controller.doidClient.chain?.contracts?.ensRegistry?.address!
  }

  public getAddresses(): Promise<Address[]> {
    if (this.addresses) return Promise.resolve(this.addresses)
    this.getConnector()
    return this.updateAddressesPromise ?? Promise.resolve([])
  }

  public getChainId(): Promise<Chain['id']> {
    if (this.chainId) return Promise.resolve(this.chainId)
    this.getConnector()
    return this.updateChainIdPromise ?? Promise.reject('Failed to get chainId')
  }

  public getDOID(address: Address): Promise<string> {
    const node = namehash(address.substring(2).toLowerCase() + '.addr.reverse')
    const abi = parseAbi(['function name(bytes32) view returns (string)'])
    const contract = getContract({
      address: this.doidContractAddress,
      abi,
      publicClient: Controller.doidClient
    })
    return contract.read.name([node])
  }

  public getDOIDAddress(name: string): Promise<Address> {
    const node = namehash(name)
    const abi = parseAbi(['function addr(bytes32 node) view returns (address)'])
    const contract = getContract({
      address: this.doidContractAddress,
      abi,
      publicClient: Controller.doidClient
    })
    return contract.read.addr([node])
  }

  private updateAddressesPromise?: Promise<Address[]>

  private async updateAddresses(connector: Connector) {
    const provider = (await connector.getProvider()) as EIP1193Provider
    if (this.connector?.id != connector.id) return
    this.updateAddressesPromise = provider.request({ method: 'eth_accounts' })
    const accounts = await this.updateAddressesPromise
    if (this.connector?.id == connector.id) {
      this.addresses = accounts
      this.updateAddressesPromise = undefined
    }
  }

  private updateChainIdPromise?: Promise<number>

  private async updateChainId(connector: Connector) {
    this.updateChainIdPromise = connector.getChainId()
    const chainId = await this.updateChainIdPromise
    if (this.connector?.id == connector.id) {
      this.chainId = chainId
      this.updateChainIdPromise = undefined
    }
  }

  private async handleChange(connector: Connector, data: WagmiConnectorData) {
    if (this.connector?.id != connector!.id) return

    if (data.chain) this.chainId = data.chain.id

    // update account and doid when changes
    if (data.account && this.account != data.account) {
      this.account = data.account
      this.updateAddresses(connector)
      this.doid = await this.getDOID(data.account)
      if (!this.doid) throw new ErrNotRegistered('Not registered', data.account!)
    }
  }

  private async handleConnect(connector: Connector, data: WagmiConnectorData): Promise<ConnectorState> {
    if (this.connector?.id != connector!.id) throw new Error('Connector has changed, abort.')
    if (this.providerChainChangedUnsubscribe) this.providerChainChangedUnsubscribe()
    await this.handleChange(connector, data)
    connector.on('change', this.handleChange.bind(this, connector))
    return { ...data, doid: this.doid }
  }

  public getConnector() {
    if (!this.connector) {
      const connector = this.buildConnector(this.lastConnector)
      if (!connector.ready) throw new ConnectorNotFoundError()
      this.resetStates(connector)
      this.updateChainId(connector)
    }

    return this.connector!
  }

  public async getWalletClient(chainId?: number): Promise<WalletClient> {
    const connector = this.connector ?? this.getConnector()
    if (!chainId) chainId = this.chainId ?? (await connector.getChainId()) ?? options.chains?.[0].id
    return await connector.getWalletClient({ chainId })
  }

  /** Check status of a DOID name. @returns `available`|`registered`|`locked`|`reserved` */
  public checkDOID(name: string): Promise<string> {
    const abi = parseAbi(['function statusOfName(string _name) view returns (string status, address owner, uint id)'])
    const contract = getContract({
      address: this.doidContractAddress,
      abi,
      publicClient: Controller.doidClient
    })
    return contract.read.statusOfName([name]).then((ret) => {
      return ret[0]
    })
  }

  public async registerDOID(name: string): Promise<string> {
    const doidChainId = Controller.doidClient.chain?.id!
    const connector = this.connector
    if (!connector) throw new Error('Not connected')
    if ((await connector.getChainId()) != doidChainId) await connector.switchChain!(doidChainId)
    const walletClient = await connector.getWalletClient({ chainId: doidChainId })

    const abi = parseAbi(['function register(string name, address owner)'])
    const contract = getContract({
      address: this.doidContractAddress,
      abi,
      walletClient
    })
    const address = walletClient.account.address
    const hash = await contract.write.register([name, address])
    const receipt = await Controller.doidClient.waitForTransactionReceipt({ hash })
    if (receipt.status === 'reverted') {
      const txn = await Controller.doidClient.getTransaction({
        hash: receipt.transactionHash
      })
      const code = (await Controller.doidClient.call({
        ...txn,
        gasPrice: txn.type !== 'eip1559' ? txn.gasPrice : undefined,
        maxFeePerGas: txn.type === 'eip1559' ? txn.maxFeePerGas : undefined,
        maxPriorityFeePerGas: txn.type === 'eip1559' ? txn.maxPriorityFeePerGas : undefined
      } as CallParameters)) as unknown as string
      const reason = hexToString(`0x${code.substring(138)}`)
      throw new Error(reason)
    }
    const expect = name + '.doid'
    if ((await this.getDOID(address)) != expect) throw new Error(`fatal: ${address} is not resolved to ${expect}`)
    return expect
  }

  private providerChainChangedUnsubscribe: any

  private resetStates(connector?: Connector) {
    this.account = undefined
    this.chainId = undefined
    this.doid = undefined
    if (!connector) return
    if (this.connector) this.connector.removeAllListeners()

    this.updateAddresses(connector)
    // not needed as only WalletConnect emits without any data
    // connector.on('connect', this.handleConnect.bind(this, connector))
    connector.on('disconnect', () => this.resetStates())
    // handle network change before connected as connectors only emit change after connected.
    if (this.providerChainChangedUnsubscribe) this.providerChainChangedUnsubscribe()
    let onChainChanged = (chainId: string) => (this.chainId = parseInt(chainId))
    connector.getProvider().then((provider) => {
      if (this.connector?.id != connector!.id || !provider?.on) return
      let p = provider as EIP1193Provider
      p.on('chainChanged', onChainChanged)
      this.providerChainChangedUnsubscribe = () => {
        p.removeListener('chainChanged', onChainChanged)
        this.providerChainChangedUnsubscribe = undefined
      }
    })
    this.connector = connector
    this.lastConnector = connector ? connector?.options.loginProvider?.name ?? connector?.id : ''
  }

  public connect({ chainId, connector }: { chainId?: Chain['id']; connector?: Connector }): Promise<ConnectorState> {
    if (connector) this.resetStates(connector)
    else connector = this.getConnector()
    return connector.connect({ chainId }).then(this.handleConnect.bind(this, connector))
  }

  public async disconnect() {
    await this.connector?.disconnect()
    this.resetStates()
  }

  public switchChain(chainId: number) {
    const connector = this.connector
    if (!connector) throw new Error('Not connected')
    if (!connector?.switchChain) throw new SwitchChainNotSupportedError({ connector })
    return connector?.switchChain(chainId)
  }
}

export const controller = new Controller()
