import { Chain, mainnet, sepolia } from '@wagmi/core'
import { doid, doidTestnet, fantomTestnet } from './chains'

export interface ConfigOptions {
  /** Name shown in connect dialog. */
  appName?: string
  chains?: Chain[]
  /** `doid | doidTestnet` */
  doidNetwork?: Chain
  themeMode?: 'light' | 'dark'
  /** Enable WalletConnect, default to false */
  walletConnectEnabled?: boolean
  /** Get your ID from WalletConnect dashboard, default to empty. */
  walletConnectId?: string
}

export let options: ConfigOptions = {
  chains: [doid, doidTestnet, mainnet, sepolia, fantomTestnet],
  doidNetwork: doid
}

if (import.meta?.env?.MODE !== 'production') {
  options.doidNetwork = doidTestnet
}

export function updateOptions(opts: ConfigOptions) {
  Object.assign(options, opts)
}

export function updateChains(chains: Chain[]) {
  if (chains.findIndex((chain) => chain.id == options.doidNetwork!.id) == -1) chains.push(options.doidNetwork!)
  options.chains = chains
}
