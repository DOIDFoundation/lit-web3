import { RestrictedMethods } from './permissions'
export const EXTENSION_MESSAGES = {
  CONNECTION_READY: 'CONNECTION_READY',
  READY: 'DOID_EXTENSION_READY'
}

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
  WATCH_ASSET_LEGACY: 'DOID_watchAsset',
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  SNAP_DIALOG_ALERT: `${RestrictedMethods.snap_dialog}:alert`,
  SNAP_DIALOG_CONFIRMATION: `${RestrictedMethods.snap_dialog}:confirmation`,
  SNAP_DIALOG_PROMPT: `${RestrictedMethods.snap_dialog}:prompt`
  ///: END:ONLY_INCLUDE_IN
} as const
export type EnvironmentType = 'popup' | 'notification' | 'fullscreen' | 'background'
export const ENVIRONMENT_TYPE_POPUP = 'popup'
export const ENVIRONMENT_TYPE_NOTIFICATION = 'notification'
export const ENVIRONMENT_TYPE_FULLSCREEN = 'fullscreen'
export const ENVIRONMENT_TYPE_BACKGROUND = 'background'

export const PLATFORM_BRAVE = 'Brave'
export const PLATFORM_CHROME = 'Chrome'
export const PLATFORM_EDGE = 'Edge'
export const PLATFORM_FIREFOX = 'Firefox'
export const PLATFORM_OPERA = 'Opera'
export const ORIGIN_METAMASK = 'DOID'
