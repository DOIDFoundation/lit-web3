// TOOD: move to controller or route
import backgroundMessenger from '~/lib.next/messenger/background'
import { MiddlerwareEngine } from './middleware'
import { publicMethods, ERR_METHOD_NOT_ALLOWED } from '~/lib.next/constants'

import * as DOID from './DOID'
import * as EVM from './EVM'
import * as Solana from './Solana'
import * as ext from './ext'
import * as popup from './popup'

export const loadAllServices = () => {
  Object.values({ ...DOID, ...EVM, ...Solana, ...ext, ...popup }).forEach((service) => {
    loadService(service)
  })
}

export const loadService = (service: BackgroundService) => {
  const { method, middlewares, allowInpage = false, fn } = service
  if (!method) throw new Error('Service has no method')
  backgroundMessenger.on(method, async (message: webextMessage) => {
    // By default, inpage methods are not allowed
    if (!allowInpage && publicMethods.includes(method)) throw new Error(`${ERR_METHOD_NOT_ALLOWED} (${method})`)
    const middleware = new MiddlerwareEngine(message, [...middlewares, fn])
    try {
      return await middleware.resolve()
    } catch (err) {
      const { res } = middleware.ctx
      res.err = err
      backgroundMessenger.log('Finally error handler:', err)
      throw err
    }
  })
}
