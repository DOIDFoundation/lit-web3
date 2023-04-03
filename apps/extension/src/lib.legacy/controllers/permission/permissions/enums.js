export const WALLET_PREFIX = 'wallet_'

export const NOTIFICATION_NAMES = {
  accountsChanged: 'DOID_accountsChanged',
  unlockStateChanged: 'DOID_unlockStateChanged',
  chainChanged: 'DOID_chainChanged'
}

export const LOG_IGNORE_METHODS = ['wallet_registerOnboarding', 'wallet_watchAsset']

export const LOG_METHOD_TYPES = {
  restricted: 'restricted',
  internal: 'internal'
}

/**
 * The permission activity log size limit.
 */
export const LOG_LIMIT = 100
