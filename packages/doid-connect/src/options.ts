import { Chain, mainnet, sepolia } from '@wagmi/core'
import { doid, doidTestnet, fantomTestnet } from './chains'
import { OPENLOGIN_NETWORK_TYPE as WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'
import { LOGIN_PROVIDER_TYPE as WEB3AUTH_PROVIDER_TYPE } from '@web3auth/openlogin-adapter'

export {
  OPENLOGIN_NETWORK as WEB3AUTH_NETWORK,
  type OPENLOGIN_NETWORK_TYPE as WEB3AUTH_NETWORK_TYPE
} from '@web3auth/base'
export {
  LOGIN_PROVIDER as WEB3AUTH_PROVIDER,
  type LOGIN_PROVIDER_TYPE as WEB3AUTH_PROVIDER_TYPE
} from '@web3auth/openlogin-adapter'

export interface ConfigOptions {
  /** Name shown in connect dialog. */
  appName?: string
  chains?: Chain[]
  /** `doid | doidTestnet` */
  doidNetwork?: Chain
  themeMode?: 'light' | 'dark'
  /**
   * Enable Web3Auth, default to false
   * @notice Use your own web3AuthClientId when developing or submit an issue to allow your domain for production.
   */
  web3AuthEnabled?: boolean
  /**
   * Use your own ID from Web3Auth dashboard when developing.
   *
   * But for production, leave this to default DOID id and submit an issue to allow your domain.
   * @notice Modifying this will cause to different wallet address
   */
  web3AuthClientId?: string
  /** Web3Auth network, `sapphire_mainnet` by default, `sapphire_devnet` when env mode development. */
  web3AuthNetwork?: WEB3AUTH_NETWORK_TYPE
  /** Web3Auth openlogin providers, default to `['google', 'apple', 'facebook', 'twitter', 'github']` */
  web3AuthProviders?: WEB3AUTH_PROVIDER_TYPE[]
  /** Enable WalletConnect, default to false */
  walletConnectEnabled?: boolean
  /** Get your ID from WalletConnect dashboard, default to empty. */
  walletConnectId?: string
}

export let options: ConfigOptions = {
  chains: [doid, doidTestnet, mainnet, sepolia, fantomTestnet],
  doidNetwork: doid,
  web3AuthClientId: 'BIitWGD0AJRTfYzndkTlIiv1Nvpaac4kGNAQjRcBuR0OOjxpkhxqCVjxJ9FO1bf-yrVJs5NRzIRqLbmrVn5JCXg',
  web3AuthNetwork: 'sapphire_mainnet',
  web3AuthProviders: ['twitter']
}

if (import.meta?.env?.MODE !== 'production') {
  options.doidNetwork = doidTestnet
  options.web3AuthNetwork = 'sapphire_devnet'
  options.web3AuthClientId = 'BFLXJsHIHv_CgxalXixrZlytDYyf47hk64XDMXOj4vNVIGGJ9HMOyhvIbYmw3dWcwxaqadObQQSwFjR51FJvgVg'
}

export function updateOptions(opts: ConfigOptions) {
  options = { ...options, ...opts }
}

export function updateChains(chains: Chain[]) {
  if (chains.findIndex((chain) => chain.id == options.doidNetwork!.id) == -1) chains.push(options.doidNetwork!)
  options.chains = chains
}
