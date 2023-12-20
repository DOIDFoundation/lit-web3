import { DOIDConnector, options } from '@doid/connect'
import { WalletClient } from '@wagmi/core'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { controller } from '@doid/connect/src/controller'

export function walletClientToProvider(walletClient: WalletClient) {
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
  public getProvider(chainId?: number): Promise<BrowserProvider> {
    if (!chainId && options.chains) chainId = options.chains[0].id
    return controller.getWalletClient(chainId).then((client) => {
      return walletClientToProvider(client)
    })
  }
  public getSigner(chainId?: number): Promise<JsonRpcSigner> {
    if (!chainId && options.chains) chainId = options.chains[0].id
    return controller.getWalletClient(chainId).then((client) => {
      return walletClientToSigner(client)
    })
  }
}
