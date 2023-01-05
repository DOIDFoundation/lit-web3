import { ZERO } from '../utils'
import { nameInfo } from '../nsResolver'
import { getAccount, getGraph } from '../useBridge'
import { subgraphQuery } from '@lit-web3/core/src/graph'
import { bareTLD } from '../nsResolver/checker'

export const reverseDOIDName = async (DOIDName = ''): Promise<Address> => {
  const account = await getAccount()
  if (account) return (await nameInfo(DOIDName)).owner ?? ''
  const api = await getGraph()
  const { doids = [] } = await subgraphQuery(`{doids(where:{name:"${bareTLD(DOIDName)}"}){coinType address {id}}}`, api)
  return doids.length ? doids[0].address.id : ZERO
}
