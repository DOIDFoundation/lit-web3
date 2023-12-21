import {
  Connector,
  ConnectorData as WagmiConnectorData,
  InjectedConnector,
  WalletClient,
  SwitchChainNotSupportedError
} from '@wagmi/core'
import { options } from './options'
import { State, property, storage } from '@lit-app/state'
import {
  Address,
  CallParameters,
  Chain,
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
  @property() private connectorState?: ConnectorState
  @storage({ key: 'doid_last_connector' })
  @property()
  private lastConnector?: string

  private static doidClient: PublicClient

  constructor() {
    super()

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
        if (type) {
          if (options.web3AuthEnabled && type in options.web3AuthProviders!) {
            return this.web3AuthConnector(type as LOGIN_PROVIDER_TYPE)
          }
          console.warn(`Unsupported connector type: ${type}`)
        }
        return new InjectedConnector({ chains: options.chains })
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
          })
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

  /** @returns connected to a connector. */
  get walletConnected(): boolean {
    return Boolean(this.connector)
  }

  /** @returns connected with a valid DOID. */
  get connected(): boolean {
    return Boolean(this.connectorState?.doid)
  }

  /** @returns connected account. */
  get account(): Address | undefined {
    return this.connectorState?.account
  }

  /** @returns DOID name of connected account. */
  get doid(): string | undefined {
    return this.connectorState?.doid
  }

  /** @returns chain id of connected connector */
  get chainId() {
    return this.connectorState?.chain?.id
  }

  protected get doidContractAddress(): Address {
    return Controller.doidClient.chain?.contracts?.ensRegistry?.address!
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

  public async getWalletClient(chainId?: number): Promise<WalletClient> {
    const connector = this.connector ?? this.buildConnector(this.lastConnector)
    if (!connector) throw new Error('Not connected')
    if (!chainId) chainId = this.chainId ?? (await connector.getChainId()) ?? options.chains?.[0].id
    console.log('get walletclient', chainId, this.chainId)
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

  private resetStates(connector?: Connector) {
    this.connectorState = undefined
    this.connector = connector
    this.lastConnector = connector ? connector?.options.loginProvider?.name ?? connector?.id : ''
  }

  public connect({ chainId, connector }: { chainId?: Chain['id']; connector?: Connector }): Promise<ConnectorState> {
    if (!connector) {
      connector = this.connector ?? this.buildConnector(this.lastConnector)
    }
    const onConnect = (data: WagmiConnectorData): Promise<ConnectorState> => {
      this.resetStates(connector)
      const saveStateWithDOID = async (data: WagmiConnectorData) => {
        // clear doid if account changed
        if (this.connectorState?.doid && data.account && this.connectorState?.account != data.account)
          this.connectorState.doid = undefined
        // apply changes
        this.connectorState = { ...this.connectorState, ...data }
        // check if we need to get doid
        if (!this.connectorState.doid) {
          let doid = await this.getDOID(this.connectorState.account!)
          if (!doid) throw new ErrNotRegistered('Not registered', data.account!)
          this.connectorState.doid = doid
        }
        return this.connectorState
      }
      connector!.on('change', saveStateWithDOID)
      return saveStateWithDOID(data)
    }
    connector.once('connect', onConnect)
    connector.once('disconnect', () => {
      this.resetStates()
    })
    return connector.connect({ chainId }).then(onConnect)
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
