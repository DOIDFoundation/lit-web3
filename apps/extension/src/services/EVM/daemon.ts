// TODO:
import { getKeyring } from '~/lib.next/keyring'
import { EvmChainProvider, EvmNetworks, EvmWalletProvider } from '@chainify/evm'

let provider: any
let promise: any
export const getEVMProvider = async () => {
  if (provider) return provider
  if (!promise)
    promise = new Promise(async (resolve) => {
      let mnemonic!: string
      try {
        const keyring = await getKeyring()
        mnemonic = await keyring.getMnemonic()
      } catch (err) {
        promise = null
        throw err
      }
      const network = EvmNetworks.ethereum_mainnet

      network.rpcUrl = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      const chainProvider = new EvmChainProvider(network)
      const walletOptions = {
        mnemonic,
        // 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
        derivationPath: `m/44'/${network.coinType}'/0'/0/0`,
        network: network
      }
      provider = new EvmWalletProvider(walletOptions, chainProvider)
      resolve(provider)
    })
  return await promise
}
