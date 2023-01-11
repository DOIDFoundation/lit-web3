import { ZERO } from '../utils'
import { nameInfo } from '../nsResolver'
import { getAccount } from '../useBridge'
import { useStorage } from '../useStorage'
import { graphQuery } from '../constants/graph'
import { bareTLD } from '../nsResolver/checker'

export const reverseDOIDName = async (DOIDName = ''): Promise<Address> => {
  let ethAddr = ''
  // 1. from cache (10m)
  const storage = await useStorage(`doid.eth.${DOIDName}`, {
    store: sessionStorage,
    withoutEnv: true,
    ttl: 1000 * 60 * 10
  })
  ethAddr = await storage.get()
  if (ethAddr) return ethAddr
  // 2. from wallet
  if (!ethAddr) {
    const account = await getAccount()
    if (account) ethAddr = (await nameInfo(DOIDName)).owner ?? ''
  }
  // 3. from graph
  if (!ethAddr) {
    try {
      const { doids = [] } = await graphQuery(
        'scan',
        `{doids(where:{name:"${bareTLD(DOIDName)}"}){coinType address {id}}}`
      )
      if (doids.length) ethAddr = doids[0].address.id
    } catch (err: any) {
      console.error(err.messages)
    }
  }
  if (ethAddr) storage.set(ethAddr)
  return ethAddr ?? ZERO
}
