import { Connector, ConnectorData as WagmiConnectorData, InjectedConnector, WalletClient } from '@wagmi/core'
import { options } from './options'
import { State, property } from '@lit-app/state'
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

export type ConnectorData = WagmiConnectorData & {
  doid?: string
}

export class ErrNotRegistered extends Error {
  public readonly account: Address
  constructor(message: string, account: Address, options?: ErrorOptions) {
    super(message, options)
    this.account = account
  }
}

export class Controller extends State {
  @property() private connector?: Connector
  @property() private state?: ConnectorData
  private doidClient: PublicClient

  constructor() {
    super()

    this.doidClient = createPublicClient({
      chain: options.doidNetwork,
      transport: http()
    })
  }

  get walletConnected(): boolean {
    return Boolean(this.connector)
  }

  get connected(): boolean {
    return Boolean(this.state?.doid)
  }

  get account(): Address | undefined {
    return this.state?.account
  }

  get doid(): string | undefined {
    return this.state?.doid
  }

  get chainId() {
    return this.state?.chain?.id
  }

  protected get doidContractAddress(): Address {
    return this.doidClient.chain?.contracts?.ensRegistry?.address!
  }

  public getDOID(address: Address): Promise<string> {
    const node = namehash(address.substring(2).toLowerCase() + '.addr.reverse')
    const abi = parseAbi(['function name(bytes32) view returns (string)'])
    const contract = getContract({
      address: this.doidContractAddress,
      abi,
      publicClient: this.doidClient
    })
    return contract.read.name([node])
  }

  public getDOIDAddress(name: string): Promise<Address> {
    const node = namehash(name)
    const abi = parseAbi(['function addr(bytes32 node) view returns (address)'])
    const contract = getContract({
      address: this.doidContractAddress,
      abi,
      publicClient: this.doidClient
    })
    return contract.read.addr([node])
  }

  public getWalletClient(chainId?: number): Promise<WalletClient> {
    if (!this.connector) throw new Error('Not connected')
    return this.connector.getWalletClient({ chainId })
  }

  public checkDOID(name: string): Promise<string> {
    const abi = parseAbi(['function statusOfName(string _name) view returns (string status, address owner, uint id)'])
    const contract = getContract({
      address: this.doidContractAddress,
      abi,
      publicClient: this.doidClient
    })
    return contract.read.statusOfName([name]).then((ret) => {
      return ret[0]
    })
  }

  public async registerDOID(name: string): Promise<string> {
    const doidChainId = this.doidClient.chain?.id!
    const connector = this.connector!
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
    const receipt = await this.doidClient.waitForTransactionReceipt({ hash })
    if (receipt.status === 'reverted') {
      const txn = await this.doidClient.getTransaction({
        hash: receipt.transactionHash
      })
      const code = (await this.doidClient.call({
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

  private setAccount(data: ConnectorData): Promise<ConnectorData> {
    return this.getDOID(data.account!).then((doid) => {
      if (!doid) {
        this.state = undefined
        throw new ErrNotRegistered('Not registered', data.account!)
      }
      data.doid = doid
      this.state = data
      return this.state
    })
  }

  public connect({ chainId, connector }: { chainId?: Chain['id']; connector?: Connector }): Promise<ConnectorData> {
    if (!connector) {
      connector = this.connector ?? new InjectedConnector({ chains: options.chains })
    }
    let onConnect = (data: WagmiConnectorData) => {
      this.connector = connector
      return this.setAccount(data).then((state) => {
        connector!.on('change', (data: WagmiConnectorData) => {
          this.setAccount(data)
        })
        return state
      })
    }
    connector.once('connect', onConnect)
    connector.once('disconnect', () => {
      this.connector = undefined
      this.state = undefined
    })
    return connector.connect({ chainId }).then(onConnect)
  }
}

export const controller = new Controller()
