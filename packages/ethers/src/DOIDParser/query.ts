import { ZERO } from '../utils'
import { nameInfo } from '../nsResolver'
import { getAccount, getGraph } from '../useBridge'
import { useStorage } from '../useStorage'
import { subgraphQuery } from '@lit-web3/core/src/graph'
import { bareTLD } from '../nsResolver/checker'

export const reverseDOIDName = async (DOIDName = ''): Promise<Address> => {
  let ethAddr = ''
  // 1. from cache
  const storage = await useStorage(`doid.eth.${DOIDName}`, sessionStorage, true)
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
      const api = await getGraph()
      const { doids = [] } = await subgraphQuery(
        `query doids{doids(where:{name:"${bareTLD(DOIDName)}"}){coinType address {id}}}`,
        api
      )
      ethAddr = doids.length ? doids[0].address.id : ZERO
    } catch (err: any) {
      console.error(err.messages)
    }
  }
  if (ethAddr) storage.set(ethAddr)
  return ethAddr
}
