// deps: getState/networkController
export const getProviderNetworkState = async function (memState) {
  const { network } = memState || this.getState()
  return {
    chainId: this.networkController.store.getState().provider.chainId,
    networkVersion: network
  }
}
