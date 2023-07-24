// Inpage Provider
import { inpageLogger } from '~/lib.next/logger'
import inpageMessenger from '~/lib.next/messenger/inpage'

type EVMMsg = { method: string; params: [] }

const EVMListeners = new Map<string, Set<Function>>()

export const initEVMInpageProvider = async () => {
  const chainId = await inpageMessenger.send('evm_request', { method: 'eth_chainId', params: [] })
  // Global listener
  inpageMessenger.on('evm_response', ({ data }) => {
    const { method, params } = data as EVMMsg
    if (EVMListeners.has(method)) EVMListeners.get(method)!.forEach((fn) => fn(params))
  })

  const subscribe = (reqMethod: string, fn: Function) => {
    if (!EVMListeners.has(reqMethod)) EVMListeners.set(reqMethod, new Set<Function>())
    EVMListeners.get(reqMethod)?.add(fn)
  }

  return {
    request: async ({ method, params } = <EVMMsg>{}) => {
      inpageLogger(`[${method}] req:`, params)
      const res = await inpageMessenger.send('evm_request', { method, params })
      inpageLogger(`[${method}] res:`, res)
      return res
    },
    addListener: subscribe,
    on: subscribe,
    removeListener: (reqMethod: string, fn: Function) => EVMListeners.get(reqMethod)?.delete(fn),
    removeAllListeners: (reqMethod: string) => EVMListeners.delete(reqMethod),
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
