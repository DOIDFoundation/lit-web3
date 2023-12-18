import { DOIDConnector, options } from '@doid/connect'
import { WalletClient } from '@wagmi/core'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { controller } from '@doid/connect/src/controller'

function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

export class DOIDConnectorEthers extends DOIDConnector {
  get signer(): Promise<JsonRpcSigner> {
    return this.getSigner()
  }

  public getSigner(chainId?: number): Promise<JsonRpcSigner> {
    if (!chainId && options.chains) chainId = options.chains[0].id
    return controller.getWalletClient(chainId).then((client) => {
      return walletClientToSigner(client)
    })
  }
}
