import { DOIDConnector, options, type WalletClient } from '@doid/connect'
import { BrowserProvider, JsonRpcSigner, Signer } from 'ethers'
import { controller } from '@doid/connect/controller'
import { createPublicClient, type PublicClient, http, webSocket, type Address } from 'viem'

function walletClientToProvider(walletClient: WalletClient | PublicClient) {
  const { chain, transport } = walletClient
  const network = chain
    ? {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address
      }
    : undefined
  return new BrowserProvider(transport, network)
}

export class DOIDConnectorEthers extends DOIDConnector {
  public readonlyProviders: { [chainId: number]: BrowserProvider } = {}
  /** Get a readonly provider */
  public getProvider(chainId?: number): BrowserProvider {
    chainId ||= controller.DOIDChainId
    const curProvider = this.readonlyProviders[chainId]
    if (curProvider) return curProvider
    const chain = chainId
      ? options.chains?.find((chain) => chain.id == chainId)
      : options?.doidNetwork ?? options?.chains?.[0]
    if (!chain)
      throw new Error(chainId ? `chain ${chainId} is not found in options.chains` : 'options.chains is empty.')
    let client = createPublicClient({ chain, transport: chain.rpcUrls.default.webSocket?.[0] ? webSocket() : http() })
    return (this.readonlyProviders[chainId] = walletClientToProvider(client))
  }

  public getChainId = async (): Promise<number> => {
    let chainId: number | undefined
    try {
      chainId = await super.getChainId()
    } catch {}
    if (!chainId) {
      const provider = await this.getProvider()
      chainId = Number((await provider.getNetwork()).chainId)
    }
    return chainId
  }

  public getAddresses = async (): Promise<Address[]> => {
    let address: Address[] = []
    try {
      address = await super.getAddresses()
    } catch {}
    return address ?? []
  }

  /** Get a signer */
  public getSigner(chainId?: number, account?: Address): Promise<Signer> {
    return controller.getWalletClient(chainId).then((client) => {
      return this.walletClientToSigner(client, account)
    })
  }

  /** Turn a walletClient to a signer */
  public walletClientToSigner(
    walletClient: WalletClient,
    account: Address | string = walletClient.account?.address ?? ''
  ) {
    return new JsonRpcSigner(walletClientToProvider(walletClient), account)
  }
}
