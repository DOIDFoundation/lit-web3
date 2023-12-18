import { ChainName } from '~/lib.next/chain/src'

export const EVMBodyParser = (): BackgroundMiddlware => {
  return async ({ state }, next) => {
    Object.assign(state, { chain: 'ethereum' })
    return next()
  }
}
