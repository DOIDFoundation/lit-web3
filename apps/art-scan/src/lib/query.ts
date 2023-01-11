import { ZERO } from '@lit-web3/ethers/src/utils'
import { genWhere, genPaging } from '@lit-web3/core/src/graph'
import { _subgraphQuery } from './graph'
import { cookColl } from './collection'

// artist hodls
export const queryHoldlNums = async (account: string) => {
  const acc = account.toLowerCase()
  let ownNum = 0,
    mintNum = 0
  if (account != ZERO) {
    const res = await _subgraphQuery()(
      `{
        owns:tokens(orderBy:createdAt orderDirection:desc where:{owner:"${acc}"}) {id}
        mints:tokens(orderBy:createdAt orderDirection:desc where:{minter:"${acc}"}) {id}
      }`
    )
    const { owns = [], mints = [] } = res
    ownNum = owns.length
    mintNum = mints.length
  }
  return { ownNum, mintNum }
}

export const genCollectionsQuery = ({ minter = '', tokenID = '' } = <CollOptions>{}, pagination?: Pagination) => {
  minter = minter.toLowerCase()
  const conditions = { minter, tokenID }
  return `{
    tokens(${genPaging(pagination)} where:{${genWhere(conditions)}} orderBy:createdAt orderDirection:desc){
      id tokenURI createdAt owner { id doids { name } }
    }
  }`
}

export const getColls = async (
  options: CollOptions,
  pagination: Pagination = { pageSize: 5, page: 1 }
): Promise<Coll[]> => {
  const { minter, doid } = options
  // exclude zero
  if (minter == ZERO) return []
  const { tokens = [] } = (await _subgraphQuery()(genCollectionsQuery(options, pagination))) || {}
  return tokens.map((token: NFTToken) => Object.assign(cookColl(token), { minter, doid }))
}

export const getColl = async (options: CollOptions): Promise<Coll | undefined> => {
  return (await getColls(options))[0]
}
