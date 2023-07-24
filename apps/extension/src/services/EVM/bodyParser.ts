import { ChainName } from '~/lib.next/chain'

export const EVMBodyParser = (): BackgroundMiddlware => {
  return async ({ state }, next) => {
    Object.assign(state, { chain: ChainName.ethereum })
    return next()
  }
}
