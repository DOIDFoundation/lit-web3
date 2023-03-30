export const getProviderState = async function (origin) {
  return {
    isUnlocked: this.isUnlocked(),
    ...this.getProviderNetworkState(),
    accounts: await this.getPermittedAccounts(origin)
  }
}
