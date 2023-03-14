import { RestrictedMethods } from './permissions'

/**
 * A string representing the type of environment the application is currently running in
 * popup - When the user click's the icon in their browser's extension bar; the default view
 * notification - When the extension opens due to interaction with a Web3 enabled website
 * fullscreen - When the user clicks 'expand view' to open the extension in a new tab
 * background - The background process that powers the extension
 */
export type EnvironmentType = 'popup' | 'notification' | 'fullscreen' | 'background'
export const ENVIRONMENT_TYPE_POPUP = 'popup'
export const ENVIRONMENT_TYPE_NOTIFICATION = 'notification'
export const ENVIRONMENT_TYPE_FULLSCREEN = 'fullscreen'
export const ENVIRONMENT_TYPE_BACKGROUND = 'background'

/**
 * The distribution this build is intended for.
 *
 * This should be kept in-sync with the `BuildType` map in `development/build/utils.js`.
 */
export const BuildType = {
  beta: 'beta',
  desktop: 'desktop',
  main: 'main'
} as const

export const PLATFORM_BRAVE = 'Brave'
export const PLATFORM_CHROME = 'Chrome'
export const PLATFORM_EDGE = 'Edge'
export const PLATFORM_FIREFOX = 'Firefox'
export const PLATFORM_OPERA = 'Opera'

export const MESSAGE_TYPE = {
  ADD_ETHEREUM_CHAIN: 'wallet_addEthereumChain',
  ETH_ACCOUNTS: RestrictedMethods.eth_accounts,
  ETH_DECRYPT: 'eth_decrypt',
  ETH_GET_ENCRYPTION_PUBLIC_KEY: 'eth_getEncryptionPublicKey',
  ETH_REQUEST_ACCOUNTS: 'eth_requestAccounts',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  GET_PROVIDER_STATE: 'DOID_getProviderState',
  LOG_WEB3_SHIM_USAGE: 'DOID_logWeb3ShimUsage',
  PERSONAL_SIGN: 'personal_sign',
  SEND_METADATA: 'DOID_sendDomainMetadata',
  SWITCH_ETHEREUM_CHAIN: 'wallet_switchEthereumChain',
  WALLET_REQUEST_PERMISSIONS: 'wallet_requestPermissions',
  WATCH_ASSET: 'wallet_watchAsset',
  WATCH_ASSET_LEGACY: 'DOID_watchAsset'
} as const

/**
 * Custom messages to send and be received by the extension
 */
export const EXTENSION_MESSAGES = {
  CONNECTION_READY: 'CONNECTION_READY',
  READY: 'DOID_EXTENSION_READY'
} as const

export const POLLING_TOKEN_ENVIRONMENT_TYPES = {
  [ENVIRONMENT_TYPE_POPUP]: 'popupGasPollTokens',
  [ENVIRONMENT_TYPE_NOTIFICATION]: 'notificationGasPollTokens',
  [ENVIRONMENT_TYPE_FULLSCREEN]: 'fullScreenGasPollTokens',
  [ENVIRONMENT_TYPE_BACKGROUND]: 'none'
} as const

export const ORIGIN_METAMASK = 'DOID'

export const METAMASK_BETA_CHROME_ID = ''
export const METAMASK_PROD_CHROME_ID = ''

export const METAMASK_MMI_BETA_CHROME_ID = ''
export const METAMASK_MMI_PROD_CHROME_ID = ''

export const CHROME_BUILD_IDS = [
  METAMASK_BETA_CHROME_ID,
  METAMASK_PROD_CHROME_ID,
  METAMASK_MMI_BETA_CHROME_ID,
  METAMASK_MMI_PROD_CHROME_ID
] as const

const METAMASK_BETA_FIREFOX_ID = 'webextension-beta@doid.tech'
const METAMASK_PROD_FIREFOX_ID = 'webextension@doid.tech'

export const FIREFOX_BUILD_IDS = [METAMASK_BETA_FIREFOX_ID, METAMASK_PROD_FIREFOX_ID] as const

export const UNKNOWN_TICKER_SYMBOL = 'UNKNOWN'
