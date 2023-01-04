import { getGraph } from '@lit-web3/ethers/src/useBridge'
import { subgraphQuery } from '@lit-web3/core/src/graph'

//WIP: update graph query
export const _subgraphQuery =
  (path = '') =>
  async (query: string) => {
    const api = (await getGraph(path)) || ''
    let res: GraphRecord = {}
    try {
      res = await subgraphQuery(query, api)
    } catch (e) {
      // throw e
    }
    return res
  }
