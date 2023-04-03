export const CaveatTypes = Object.freeze({
  restrictReturnedAccounts: 'restrictReturnedAccounts' as const
})

export const RestrictedMethods = Object.freeze({
  eth_accounts: 'eth_accounts',
  DOID_name: 'DOID_name',
  DOID_account: 'DOID_account'
} as const)
