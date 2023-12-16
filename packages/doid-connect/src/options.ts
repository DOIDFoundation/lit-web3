import { Chain, mainnet, sepolia } from '@wagmi/core/chains'
import { OPENLOGIN_NETWORK, OPENLOGIN_NETWORK_TYPE } from '@web3auth/base'
import { doid, doidTestnet } from './chains'

export { OPENLOGIN_NETWORK } from '@web3auth/base'

export interface ConfigOptions {
  appName?: string
  web3AuthClientId?: string
  web3AuthNetwork?: OPENLOGIN_NETWORK_TYPE
  walletConnectId?: string
  chains?: Chain[]
  doidNetwork?: Chain
}

export let options: ConfigOptions = {
  chains: [doid, doidTestnet, mainnet, sepolia],
  doidNetwork: doid,
  web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET
}

if (import.meta?.env?.MODE !== 'production') {
  options.doidNetwork = doidTestnet
  options.web3AuthNetwork = OPENLOGIN_NETWORK.SAPPHIRE_DEVNET
}

export function updateOptions(opts: ConfigOptions) {
  options = { ...options, ...opts }
}

export function updateChains(chains: Chain[]) {
  if (chains.findIndex((chain) => chain.id == options.doidNetwork!.id) == -1) chains.push(options.doidNetwork!)
  options.chains = chains
}
