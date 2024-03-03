import {
  Config,
  connect,
  Connector,
  ConnectorAlreadyConnectedError,
  createConfig,
  CreateConnectorFn,
  disconnect,
  getConnections,
  getConnectors,
  getPublicClient,
  getTransaction,
  getWalletClient,
  readContract,
  reconnect,
  switchChain,
  waitForTransactionReceipt,
  watchAccount,
  watchChainId,
  writeContract,
  watchConnections
} from '@wagmi/core'
import { options } from './options'
import { State, property, storage } from '@lit-web3/base/state'
import emitter from '@lit-web3/base/emitter'
export { StateController } from '@lit-web3/base/state'
import { Address, CallParameters, Chain, WalletClient, createClient, hexToString, http, namehash, parseAbi } from 'viem'
import { coinbaseWallet, walletConnect } from '@wagmi/connectors'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { LOGIN_PROVIDER_TYPE, OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { doid, doidTestnet } from './chains'
import { web3auth } from './connector/web3auth'

type WEB3_PROVIDER = LOGIN_PROVIDER_TYPE | 'more'

export type ConnectorState = {
  account: Address
  chainId: number
  doid?: string
}

export { type Connector } from '@wagmi/core'

export class ErrNotRegistered extends Error {
  public readonly account: Address
  constructor(message: string, account: Address, options?: ErrorOptions) {
    super(message, options)
    this.account = account
  }
}

const checkNetwork = (chainId: any) => {
  return chainId && options.chains.some((chain) => +chain.id == +chainId)
}
export class Controller extends State {
  // @property() private connector?: Connector
  /** a list of addresses accessible */
  @property() public addresses?: Address[]
  /** connected account. */
  @property() public account?: Address
  /** current chain id of connected connector */
  @property()
  public chainId?: Chain['id']
  /** chain id of user subjective selected DOIDChains */
  @storage({ key: 'doid-connect.selectedChainId' })
  @property()
  public selectedChainId?: Chain['id'] | string
  /** DOID name of connected account. */
  @property() public doid?: string
  // @storage({ key: 'doid_last_connector' })
  // @property()
  // lastConnector?: string

  constructor() {
    super()
    // Only delete on initialization
    if (!checkNetwork(this.selectedChainId)) this.selectedChainId = ''
  }

  get DOIDChainId() {
    return +(this.selectedChainId || options?.doidNetwork?.id || this.chainId || options?.chains?.[0]?.id || doid.id)
  }
  get DOIDChain() {
    return options.chains.find((chain) => +chain.id == +this.DOIDChainId)!
  }

  private _wagmiConfig?: Config
  get wagmiConfig() {
    return this._wagmiConfig ?? this.newWagmiConfig()
  }

  private unWatchFns: (() => void)[] = []
  public newWagmiConfig() {
    this.unWatchFns.forEach((unWatch) => unWatch())
    this.unWatchFns = []
    const { doidNetwork, chains } = options
    if (!chains.find((x) => x.id == doidNetwork.id)) chains.push(doidNetwork)
    this.doid = undefined // reset doid because doid network may be changed
    this._wagmiConfig = createConfig({
      chains: options.chains as any,
      connectors: [
        ...(options.walletConnectEnabled ? [walletConnect({ projectId: options.walletConnectId! })] : []),
        coinbaseWallet({ appName: options.appName ?? 'DOID' }),
        ...(this.web3AuthEnabled ? this.web3AuthProviders.map((provider) => this.web3AuthConnector(provider)) : [])
      ],
      client({ chain }) {
        return createClient({ chain, transport: http() })
      }
    })
    this.unWatchFns.push(
      watchAccount(this._wagmiConfig, {
        onChange: (data) => this.handleChange(data.address, data.addresses)
      })
    )
    // Watch last selected chainId in options.chains list
    // this.unWatchFns.push(
    //   watchChainId(this._wagmiConfig, {
    //     onChange: (chainId) => this.handleChainId(chainId)
    //   })
    // )
    // Watch last selected chainId
    this.unWatchFns.push(
      watchConnections(this._wagmiConfig, {
        onChange: ([conn, conn2] = []) => {
          if (conn) this.handleChainId(conn.chainId)
        }
      })
    )
    return this._wagmiConfig
  }

  public readonly web3AuthEnabled = true
  private get web3AuthClientId() {
    return this.DOIDChainId == doid.id
      ? 'BIitWGD0AJRTfYzndkTlIiv1Nvpaac4kGNAQjRcBuR0OOjxpkhxqCVjxJ9FO1bf-yrVJs5NRzIRqLbmrVn5JCXg'
      : 'BFLXJsHIHv_CgxalXixrZlytDYyf47hk64XDMXOj4vNVIGGJ9HMOyhvIbYmw3dWcwxaqadObQQSwFjR51FJvgVg'
  }
  private get web3AuthNetwork() {
    return this.DOIDChainId == doid.id ? 'sapphire_mainnet' : 'sapphire_devnet'
  }
  public get web3AuthProviders(): WEB3_PROVIDER[] {
    return this.DOIDChainId == doid.id ? ['twitter', 'github', 'more'] : ['twitter', 'github', 'more']
  }

  public availableConnectors(): readonly Connector[] {
    return this.wagmiConfig.connectors
  }

  private static web3authInstance: Web3AuthNoModal
  private web3AuthConnector(providerName: WEB3_PROVIDER): CreateConnectorFn {
    // force recreate web3authInstance to set sessionNamespace to provider.
    // to avoid wrong account from cache when connect with different provider.
    // because web3auth caches last account per sessionNamespace rather than per provider.
    // Q1: Maybe it works fine now?
    if (!Controller.web3authInstance) {
      if (this.web3AuthEnabled && !this.web3AuthClientId) {
        throw new Error('Web3Auth Client ID is not configured.')
      }

      const chainId = this.DOIDChainId
      const chain = options.chains.find((c) => c.id == chainId)
      if (!chain)
        throw new Error(chainId ? `chain ${chainId} not found in options.chains` : 'options.chains is not configured.')
      const chainConfig = {
        chainId: '0x' + chainId.toString(16),
        rpcTarget: chain.rpcUrls.default.http[0],
        displayName: chain.name,
        tickerName: chain.nativeCurrency?.name,
        ticker: chain.nativeCurrency?.symbol,
        blockExplorer: chain.blockExplorers?.default?.url ?? ''
      }
      const web3auth = new Web3AuthNoModal({
        clientId: this.web3AuthClientId!,
        web3AuthNetwork: this.web3AuthNetwork,
        chainConfig: { ...chainConfig, chainNamespace: CHAIN_NAMESPACES.EIP155 }
      })
      Controller.web3authInstance = web3auth

      web3auth.configureAdapter(
        new OpenloginAdapter({
          privateKeyProvider: new EthereumPrivateKeyProvider({
            config: { chainConfig }
          }),
          loginSettings: {
            mfaLevel: 'none',
            extraLoginOptions: {
              domain: 'https://auth.doid.tech'
            }
          },
          adapterSettings: {
            // safari blocks popup
            uxMode: /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? 'redirect' : 'popup',
            sessionNamespace: providerName,
            whiteLabel: {
              appName: options.appName,
              logoDark: 'https://doid.tech/logo.svg',
              logoLight: 'https://doid.tech/logo.svg',
              theme: { primary: '#FFF' }
            },
            loginConfig: {
              twitter: {
                verifier: 'doid-auth0',
                typeOfLogin: 'jwt',
                verifierSubIdentifier: 'twitter',
                clientId: 'R2WBTkKbr25H373Xapi38hyl9AsOgbsI'
              },
              github: {
                verifier: 'doid-auth0',
                typeOfLogin: 'jwt',
                verifierSubIdentifier: 'github',
                clientId: 'R2WBTkKbr25H373Xapi38hyl9AsOgbsI'
              },
              facebook: {
                verifier: 'doid-auth0',
                typeOfLogin: 'facebook',
                verifierSubIdentifier: 'facebook',
                clientId: '402488142221460'
              },
              more: {
                verifier: 'doid-auth0',
                typeOfLogin: 'jwt',
                verifierSubIdentifier: 'other',
                clientId: 'dfXudeV0HvdftL0oYUJMTQRkq3inje2Q'
              }
            }
          }
        })
      )
    }
    return web3auth({
      web3AuthInstance: Controller.web3authInstance,
      loginParams: {
        loginProvider: providerName
      }
    })
  }

  /** @returns is connector usable. */
  get ready(): boolean {
    return getConnections(this.wagmiConfig).length > 0
  }

  /** @returns connected with a valid DOID. */
  get connected(): boolean {
    return Boolean(this.doid)
  }

  protected get doidContractAddress(): Address {
    return this.DOIDChain.contracts?.ensRegistry?.address!
  }

  public getAddresses = async (): Promise<Address[]> => {
    if (this.addresses) return Promise.resolve(this.addresses)
    // return this.reconnect().then(() => this.addresses ?? [])
    try {
      await this.reconnect()
    } catch {}
    return this.addresses ?? []
  }

  public getChainId(): Promise<Chain['id']> {
    if (this.chainId) return Promise.resolve(this.chainId)
    return this.reconnect().then(() => {
      if (this.chainId) return this.chainId
      throw new Error('Failed to get chainId')
    })
  }

  public getDOID(address: Address): Promise<string> {
    const node = namehash(address.substring(2).toLowerCase() + '.addr.reverse')
    const abi = parseAbi(['function name(bytes32) view returns (string)'])
    return readContract(this.wagmiConfig, {
      chainId: this.DOIDChainId,
      address: this.doidContractAddress,
      abi,
      functionName: 'name',
      args: [node]
    })
  }

  public getDOIDAddress(name: string): Promise<Address> {
    const node = namehash(name)
    const abi = parseAbi(['function addr(bytes32 node) view returns (address)'])
    return readContract(this.wagmiConfig, {
      chainId: this.DOIDChainId,
      address: this.doidContractAddress,
      abi,
      functionName: 'addr',
      args: [node]
    })
  }

  get invalidNetwork() {
    return !checkNetwork(this.chainId)
  }

  private handleChainId = (chainId: number, userSelectFirst = true) => {
    this.chainId = chainId
    if (userSelectFirst && checkNetwork(chainId)) this.selectedChainId = chainId
    this.handleChange(this.account, this.addresses, chainId)
  }

  private async handleChange(account?: Address, addresses?: readonly Address[], chainId?: number) {
    // update account and doid when changes
    if (account && (chainId || !this.doid || this.account != account)) {
      this.doid = await this.getDOID(account)
      this.account = account
      this.addresses = [...addresses!]
      console.debug(`[doid] connected with doid: '${this.doid}' (address: '${account}')`)
      // this.updateAddresses(connector)
      if (!this.doid) {
        emitter.emit('doid-connect-nosignup', { account })
        console.warn(new ErrNotRegistered('Not registered', account))
      } else emitter.emit('doid-connect-ok', { account, doid: this.doid })
    }
  }

  public getConnector() {
    // return getConnectors(this.wagmiConfig)[0]
    return getConnections(this.wagmiConfig)[0]?.connector
  }

  public async getWalletClient(chainId?: number): Promise<WalletClient> {
    // const connector = this.connector ?? this.getConnector()
    // if (!chainId) chainId = this.chainId ?? (await connector.getChainId()) ?? options.chains?.[0].id
    await this.reconnect()
    return await getWalletClient(this.wagmiConfig, { chainId })
  }

  /** Check status of a DOID name. @returns `available`|`registered`|`locked`|`reserved` */
  public checkDOID(name: string): Promise<string> {
    const abi = parseAbi(['function statusOfName(string _name) view returns (string status, address owner, uint id)'])
    return readContract(this.wagmiConfig, {
      chainId: this.DOIDChainId,
      address: this.doidContractAddress,
      abi,
      functionName: 'statusOfName',
      args: [name]
    }).then((ret) => ret[0])
  }

  amendChainId = async (chainId?: number) => {
    if (this.invalidNetwork || this.chainId != this.DOIDChainId)
      return await this.slientSwitchChain(chainId || this.DOIDChainId)
    if (chainId && chainId != this.chainId) await this.slientSwitchChain(chainId)
  }

  registering = false
  public async registerDOID(name: string): Promise<string> {
    await this.amendChainId()
    const chainId = this.DOIDChainId
    const abi = parseAbi(['function register(string name, address owner)'])
    const address = this.account!
    this.registering = true
    try {
      const hash = await writeContract(this.wagmiConfig, {
        chainId,
        address: this.doidContractAddress,
        abi,
        functionName: 'register',
        args: [name, address]
      })
      const receipt = await waitForTransactionReceipt(this.wagmiConfig, { chainId, hash })
      if (receipt.status === 'reverted') {
        const txn = await getTransaction(this.wagmiConfig, {
          chainId,
          hash: receipt.transactionHash
        })
        const code = (await getPublicClient(this.wagmiConfig, { chainId })?.call({
          ...txn,
          gasPrice: txn.type !== 'eip1559' ? txn.gasPrice : undefined,
          maxFeePerGas: txn.type === 'eip1559' ? txn.maxFeePerGas : undefined,
          maxPriorityFeePerGas: txn.type === 'eip1559' ? txn.maxPriorityFeePerGas : undefined
        } as CallParameters)) as unknown as string
        const reason = hexToString(`0x${code.substring(138)}`)
        throw new Error(reason)
      }
    } catch (err) {
      throw err
    } finally {
      this.registering = false
    }
    const expect = name + '.doid'
    if ((await this.getDOID(address)) != expect) throw new Error(`fatal: ${address} is not resolved to ${expect}`)
    return expect
  }

  private resetStates() {
    this.addresses = []
    this.account = undefined
    this.chainId = undefined
    this.doid = undefined
    this.selectedChainId = undefined
  }

  private reconnectPromise?: any
  public reconnect(): Promise<ConnectorState> {
    if (!this.reconnectPromise)
      this.reconnectPromise = (
        this.wagmiConfig.state.status == 'connected'
          ? this.handleChange(this.account!, this.addresses) // check doid again when already connected but doid is not registered
          : reconnect(this.wagmiConfig).then(([conn] = []) => {
              if (!conn) throw new Error('No connection found')
              this.chainId = conn.chainId
              return this.handleChange(conn.accounts[0], conn.accounts)
            })
      )
        .then(() => {
          return {
            account: this.account,
            doid: this.doid,
            chainId: this.chainId
          }
        })
        .finally(() => (this.reconnectPromise = undefined))
    return this.reconnectPromise
  }

  public connect({ chainId, connector }: { chainId?: Chain['id']; connector: Connector }): Promise<ConnectorState> {
    return connect(this.wagmiConfig, { chainId, connector })
      .then(async (data) => {
        this.chainId = data.chainId
        try {
          await this.amendChainId()
        } catch {}
        return this.handleChange(data.accounts[0], data.accounts)
      })
      .catch(async (e) => {
        if (!(e instanceof ConnectorAlreadyConnectedError)) throw e
        // already connected
        try {
          // switch chain when needed
          if (chainId) await this.amendChainId(chainId)
        } catch {}
        // check doid again when already connected but doid is not registered
        return this.handleChange(this.account, this.addresses)
      })
      .then(() => {
        return { account: this.account!, chainId: this.chainId!, doid: this.doid }
      })
  }

  public async disconnect(): Promise<void> {
    await disconnect(this.wagmiConfig)
    this.resetStates()
  }

  public switchChain(chainId: number, { userSelectFirst = true } = {}): Promise<void> {
    console.debug(`[doid] switch to chain id ${chainId}`)
    return switchChain(this.wagmiConfig, { chainId }).then(() => {
      this.handleChainId(chainId, userSelectFirst)
    })
  }
  public slientSwitchChain(chainId: number): Promise<void> {
    return this.switchChain(chainId, { userSelectFirst: false })
  }
}

export const controller = new Controller()
