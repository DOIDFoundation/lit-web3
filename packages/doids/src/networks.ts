import { DOIDNetworks } from './constants/networks'

const isProd = import.meta.env.MODE === 'production'

export const defaultChainId: DOIDChainId = isProd ? 'testnet' : 'testnet'
export const defaultNetwork: DOIDNetwork = DOIDNetworks[defaultChainId]

export const getDOIDNetwork = (chainId = defaultChainId) => {
  return DOIDNetworks[chainId]
}
