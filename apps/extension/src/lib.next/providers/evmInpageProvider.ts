// Inpage Provider
import { inpageLogger } from '~/lib.next/logger'
import inpageMessenger from '~/lib.next/messenger/inpage'

export const initEVMInpageProvider = async () => {
  const chainId = await inpageMessenger.send('evm_request', { method: 'eth_chainId', params: [] })
  return {
    request: async ({ method, params } = <Record<string, any>>{}) => {
      inpageLogger(`[${method}] req:`, params)
      const res = await inpageMessenger.send('evm_request', { method, params })
      inpageLogger(`[${method}] res:`, res)
      return res
    },
    addListener: inpageMessenger.on,
    on: inpageMessenger.on,
    chainId,
    isMetaMask: true
  }
}

export const injectEVMInpageProvider = async () => {
  if (!('ethereum' in window)) {
    // @ts-expect-error
    window.ethereum = await initEVMInpageProvider()
    inpageLogger('injected-ethereum')
    dispatchEvent(new Event('ethereum#initialized'))
  }
}
