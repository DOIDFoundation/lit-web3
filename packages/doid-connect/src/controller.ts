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
  writeContract
} from '@wagmi/core'
import { options } from './options'
import { State, property } from '@lit-web3/base/state'
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

export class Controller extends State {
  // @property() private connector?: Connector
  /** a list of addresses accessible */
  @property() public addresses?: Address[]
  /** connected account. */
  @property() public account?: Address
  /** chain id of connected connector */
  @property() public chainId?: Chain['id']
  /** DOID name of connected account. */
  @property() public doid?: string
  // @storage({ key: 'doid_last_connector' })
  // @property()
  // lastConnector?: string

  private _wagmiConfig?: Config
  get wagmiConfig() {
    return this._wagmiConfig ?? this.newWagmiConfig()
  }

  private unWatchFns: (() => void)[] = []
  public newWagmiConfig() {
    this.unWatchFns.forEach((unWatch) => unWatch())
    this.unWatchFns = []
    this.resetStates()
    if (options.chains.find((x) => x.id == doid.id)) options.chains.push(doid)
    this._wagmiConfig = createConfig({
      chains: [...(options.chains ?? []), doid, doidTestnet] as any,
      connectors: [
        ...(options.walletConnectEnabled
          ? [
              walletConnect({
                projectId: options.walletConnectId!
                // metadata: {
                //   name: options.appName ?? 'DOID'
                // }
              })
            ]
          : []),
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
    this.unWatchFns.push(
      watchChainId(this._wagmiConfig, {
        onChange: (data) => (this.chainId = data)
      })
    )
    return this._wagmiConfig
  }

  public readonly web3AuthEnabled = true
  private get web3AuthClientId() {
    return options.doidNetwork?.id == doid.id
      ? 'BIitWGD0AJRTfYzndkTlIiv1Nvpaac4kGNAQjRcBuR0OOjxpkhxqCVjxJ9FO1bf-yrVJs5NRzIRqLbmrVn5JCXg'
      : 'BFLXJsHIHv_CgxalXixrZlytDYyf47hk64XDMXOj4vNVIGGJ9HMOyhvIbYmw3dWcwxaqadObQQSwFjR51FJvgVg'
  }
  private get web3AuthNetwork() {
    return options.doidNetwork?.id == doid.id ? 'sapphire_mainnet' : 'sapphire_devnet'
  }
  public get web3AuthProviders(): WEB3_PROVIDER[] {
    return options.doidNetwork?.id == doid.id ? ['twitter', 'github', 'more'] : ['twitter', 'github', 'more']
  }

  public availableConnectors(): readonly Connector[] {
    return this.wagmiConfig.connectors
  }

  private static web3authInstance: Web3AuthNoModal
  private web3AuthConnector(provider: WEB3_PROVIDER): CreateConnectorFn {
    // force recreate web3authInstance to set sessionNamespace to provider.
    // to avoid wrong account from cache when connect with different provider.
    // because web3auth caches last account per sessionNamespace rather than per provider.
    // if (!Controller.web3authInstance) {
    {
      if (this.web3AuthEnabled && !this.web3AuthClientId) {
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
            sessionNamespace: options.doidNetwork?.name + provider,
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
        loginProvider: provider
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
    return options.doidNetwork.contracts?.ensRegistry?.address!
  }

  public getAddresses(): Promise<Address[]> {
    if (this.addresses) return Promise.resolve(this.addresses)
    return this.reconnect().then(() => this.addresses ?? [])
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
      chainId: options.doidNetwork.id,
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
      chainId: options.doidNetwork.id,
      address: this.doidContractAddress,
      abi,
      functionName: 'addr',
      args: [node]
    })
  }

  private async handleChange(account?: Address, addresses?: readonly Address[]) {
    // update account and doid when changes
    if (account && this.account != account) {
      this.doid = await this.getDOID(account)
      this.account = account
      this.addresses = [...addresses!]
      // this.updateAddresses(connector)
      if (!this.doid) {
        emitter.emit('doid-connect-nosignup', { account })
        throw new ErrNotRegistered('Not registered', account)
      } else emitter.emit('doid-connect-ok', { account, doid: this.doid })
    }
  }

  public getConnector() {
    return getConnectors(this.wagmiConfig)[0]
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
      chainId: options.doidNetwork.id,
      address: this.doidContractAddress,
      abi,
      functionName: 'statusOfName',
      args: [name]
    }).then((ret) => ret[0])
  }

  registering = false
  public async registerDOID(name: string): Promise<string> {
    const abi = parseAbi(['function register(string name, address owner)'])
    const address = this.account!
    this.registering = true
    try {
      const hash = await writeContract(this.wagmiConfig, {
        chainId: options.doidNetwork.id,
        address: this.doidContractAddress,
        abi,
        functionName: 'register',
        args: [name, address]
      })
      const receipt = await waitForTransactionReceipt(this.wagmiConfig, { chainId: options.doidNetwork.id, hash })
      if (receipt.status === 'reverted') {
        const txn = await getTransaction(this.wagmiConfig, {
          chainId: options.doidNetwork.id,
          hash: receipt.transactionHash
        })
        const code = (await getPublicClient(this.wagmiConfig, { chainId: options.doidNetwork.id })?.call({
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
  }

  private reconnectPromise?: any
  public reconnect(): Promise<ConnectorState> {
    if (this.wagmiConfig.state.status == 'connected')
      return Promise.resolve({
        account: this.account!,
        doid: this.doid,
        chainId: this.chainId!
      })
    return (this.reconnectPromise ??= reconnect(this.wagmiConfig)
      .then((connections) => {
        if (connections.length == 0) return undefined
        this.chainId = connections[0].chainId
        this.handleChange(connections[0].accounts[0], connections[0].accounts)
        return {
          account: this.account,
          doid: this.doid,
          chainId: this.chainId
        }
      })
      .finally(() => (this.reconnectPromise = undefined)))
  }

  public connect({ chainId, connector }: { chainId?: Chain['id']; connector: Connector }): Promise<ConnectorState> {
    return connect(this.wagmiConfig, { chainId, connector })
      .then((data) => {
        this.chainId = data.chainId
        return this.handleChange(data.accounts[0], data.accounts)
      })
      .catch((e) => {
        if (!(e instanceof ConnectorAlreadyConnectedError)) throw e
      })
      .then(() => {
        return { account: this.account!, chainId: this.chainId!, doid: this.doid }
      })
  }

  public async disconnect() {
    await disconnect(this.wagmiConfig)
    this.resetStates()
  }

  public switchChain(chainId: number) {
    return switchChain(this.wagmiConfig, { chainId })
  }
}

export const controller = new Controller()
