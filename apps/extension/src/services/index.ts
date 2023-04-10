// TOOD: move to controller or route
import backgroundMessenger from '~/lib.next/messenger/background'
import { MiddlerwareEngine } from './middleware'

import * as EVM from './EVM'
import * as DOID from './DOID'
import * as ext from './ext'

export const loadService = (service: BackgroundService) => {
  const { method, middlewares, fn } = service
  if (!method) return backgroundMessenger.log('Service has no method:', service)
  backgroundMessenger.on(method, async (message: webextMessage) => {
    const middleware = new MiddlerwareEngine(message, middlewares.concat(fn))
    try {
      const res = await middleware.resolve()
      return res
    } catch (err) {
      const { ctx } = middleware
      ctx.res.respond = ctx.res.err = true
      backgroundMessenger.log('Finally error handler:', err)
      throw err
    }
  })
}

export const loadAllServices = () => {
  Object.values({ ...DOID, ...EVM, ...ext }).forEach((service) => {
    loadService(service)
  })
}
