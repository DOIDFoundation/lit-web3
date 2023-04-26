// Inpage Provider
import { inpageLogger } from '~/lib.next/logger'
import inpageMessenger from '~/lib.next/messenger/inpage'

export const EVMInpageProvider = () => {
  return {
    request: async ({ method, params } = <Record<string, any>>{}) => {
      inpageLogger('requested', method, params)
      const res = await inpageMessenger.send('evm_request', { method, params })
      inpageLogger('response', res)
      return res
    },
    addListener: inpageMessenger.on,
    on: inpageMessenger.on,
    chainId: '0x1',
    isMetaMask: true
  }
}

export const injectEVMInpageProvider = () => {
  if (!('ethereum' in window)) {
    // @ts-expect-error
    window.ethereum = EVMInpageProvider()
    dispatchEvent(new Event('ethereum#initialized'))
    inpageLogger('injected-opensea')
  }
}
