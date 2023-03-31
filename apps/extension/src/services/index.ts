// TOOD: move to controller or route
import backgroundMessenger from '~/lib.next/messenger/background'

import * as EVM from './EVM'
import * as DOID from './DOID'
import * as ext from './ext'

// Simple middleware implementation
export const loadService = (service: BackgroundService) => {
  const { method, middlewares, fn } = service
  if (!method) return backgroundMessenger.log('Service has no method:', service)
  backgroundMessenger.on(method, async (ctx: BackgroundMiddlwareCtx) => {
    for (let middleware of middlewares) {
      await new Promise((next) => middleware(ctx, next))
    }
    return await new Promise((next) => fn(ctx, next))
  })
}

export const loadAllServices = () => {
  Object.values({ ...DOID, ...EVM, ...ext }).forEach((service) => {
    loadService(service)
  })
}
