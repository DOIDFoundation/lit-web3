// Inpage Provider
import { inpageLogger } from '~/lib.next/logger'
import inpageMessenger from '~/lib.next/messenger/inpage'

export const DOIDInpageProvider = () => {
  return {
    request: async ({ method, params } = <Record<string, any>>{}) => {
      inpageLogger('requested', method, params)
      const res = await inpageMessenger.send(method, params)
      inpageLogger('response', res)
      return res
    },
    on: inpageMessenger.on,
    isConnected: async () => {}
  }
}

export const injectDOIDInpageProvider = () => {
  if (!('DOID' in window)) {
    // @ts-expect-error
    window.DOID = DOIDInpageProvider()
    dispatchEvent(new Event('DOID#initialized'))
  }
}
