// Inpage Provider
import { inpageLogger } from '~/lib.next/logger'
import inpageMessenger from '~/lib.next/messenger/inpage'

export const inpageProvider = () => {
  return {
    request: async ({ method, params } = <Record<string, any>>{}) => {
      inpageLogger('requested', method, params)
      const res = await inpageMessenger.send(method, params)
      inpageLogger('response', res)
      return res
    },
    on: inpageMessenger.on
  }
}

export const injectInpageProvider = () => {
  if (!('DOID' in window)) {
    // @ts-expect-error
    window.DOID = inpageProvider()
    dispatchEvent(new Event('DOID#initialized'))
    inpageLogger('injected')
  }
}