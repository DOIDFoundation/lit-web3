import { DOIDConnector, options } from '@doid/connect'
import { PublicClient, WalletClient } from '@wagmi/core'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { controller } from '@doid/connect/src/controller'
import { createPublicClient, http, webSocket } from 'viem'

export function walletClientToProvider(walletClient: WalletClient | PublicClient) {
  const { chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  return new BrowserProvider(transport, network)
}

export function walletClientToSigner(walletClient: WalletClient) {
  return new JsonRpcSigner(walletClientToProvider(walletClient), walletClient.account.address)
}

export class DOIDConnectorEthers extends DOIDConnector {
  public getProvider(chainId?: number): BrowserProvider {
    let chain = chainId ? options.chains?.find((chain) => chain.id == chainId) : options?.chains?.[0]
    if (!chain)
      throw new Error(chainId ? `chain ${chainId} is not found in options.chains` : 'options.chains is empty.')
    let client = createPublicClient({ chain, transport: chain.rpcUrls.default.webSocket?.[0] ? webSocket() : http() })
    return walletClientToProvider(client)
  }
  public getSigner(chainId?: number): Promise<JsonRpcSigner> {
    if (!chainId && options.chains) chainId = options.chains[0].id
    return controller.getWalletClient(chainId).then((client) => {
      return walletClientToSigner(client)
    })
  }
}
