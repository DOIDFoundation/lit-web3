import { Chain, mainnet, goerli } from '@wagmi/core/chains'
import { OPENLOGIN_NETWORK, OPENLOGIN_NETWORK_TYPE } from '@web3auth/base'

export interface ConfigOptions {
  appName?: string
  web3AuthClientId?: string
  web3AuthNetwork?: OPENLOGIN_NETWORK_TYPE
  walletConnectId?: string
  chains?: Chain[]
}

export let options: ConfigOptions = {
  chains: [mainnet, goerli],
  web3AuthNetwork:
    import.meta.env.MODE === 'production' ? OPENLOGIN_NETWORK.SAPPHIRE_MAINNET : OPENLOGIN_NETWORK.SAPPHIRE_DEVNET
}

export function updateOptions(opts: ConfigOptions) {
  options = { ...options, ...opts }
}

export function updateChains(chains: Chain[]) {
  options.chains = chains
}
