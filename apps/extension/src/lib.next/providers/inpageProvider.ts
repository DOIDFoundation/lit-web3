// Inpage Provider
import { inpageLogger } from '~/lib.next/logger'
// import { setNamespace, sendMessage, onMessage } from 'webext-bridge/window'
// import { BACKGROUND } from '~/lib.next/constants'
import inpageMessenger from '~/lib.next/messenger/inpage'

export const inpageProvider = () => {
  return {
    request: async ({ method, params } = <Record<string, any>>{}) => {
      inpageLogger('requested', method, params)
      const res = await inpageMessenger.emitter.sendMessage(method, params)
      inpageLogger('response', res)
      return res
    }
  }
}

export const injectInpageProvider = () => {
  if (!('DOID' in window)) {
    ;(window as any).DOID = inpageProvider()
    window.dispatchEvent(new Event('DOID#initialized'))
    inpageLogger('injected')
  }
}

inpageMessenger.on('DOID_setup', ({ data }) => {
  inpageLogger(data)
})
