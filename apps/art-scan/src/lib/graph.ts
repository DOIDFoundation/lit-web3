import { getGraph } from '@lit-web3/ethers/src/useBridge'
import { subgraphQuery } from '@lit-web3/core/src/graph'

//WIP: update graph query
export const _subgraphQuery =
  (path = '') =>
  async (query: string): Promise<GraphRecord> => {
    const api = (await getGraph(path)) || ''
    return await subgraphQuery(api, query)
  }
