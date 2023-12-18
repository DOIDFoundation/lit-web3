import '@lit-web3/core/src/shims/node'
import { Chain, mainnet, sepolia, doid, doidTestnet } from './chains'
import { OPENLOGIN_NETWORK_TYPE as WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'
import { LOGIN_PROVIDER_TYPE as WEB3AUTH_PROVIDER_TYPE } from '@web3auth/openlogin-adapter'

export { OPENLOGIN_NETWORK as WEB3AUTH_NETWORK } from '@web3auth/base'
export { LOGIN_PROVIDER as WEB3AUTH_PROVIDER } from '@web3auth/openlogin-adapter'

export interface ConfigOptions {
  appName?: string
  chains?: Chain[]
  /** `doid | doidTestnet` */
  doidNetwork?: Chain
  web3AuthEnabled?: boolean
  web3AuthClientId?: string // Get your Client ID from the Web3Auth Dashboard
  web3AuthNetwork?: WEB3AUTH_NETWORK_TYPE
  web3AuthProviders?: WEB3AUTH_PROVIDER_TYPE[]
  walletConnectEnabled?: boolean
  walletConnectId?: string // Get your ID from the WalletConnect Dashboard
}

export let options: ConfigOptions = {
  chains: [doid, doidTestnet, mainnet, sepolia],
  doidNetwork: doid,
  web3AuthNetwork: 'sapphire_mainnet',
  web3AuthProviders: ['google', 'apple', 'facebook', 'twitter', 'github']
}

if (import.meta?.env?.MODE !== 'production') {
  options.doidNetwork = doidTestnet
  options.web3AuthNetwork = 'sapphire_devnet'
}

export function updateOptions(opts: ConfigOptions) {
  options = { ...options, ...opts }
}

export function updateChains(chains: Chain[]) {
  if (chains.findIndex((chain) => chain.id == options.doidNetwork!.id) == -1) chains.push(options.doidNetwork!)
  options.chains = chains
}
