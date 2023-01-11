import { ZERO } from '@lit-web3/ethers/src/utils'
import { graphQuery, genWhere, genPaging } from '@lit-web3/ethers/src/constants/graph'
import { cookColl } from './collection'

// artist hodls
export const queryHoldlNums = async (account: string) => {
  const acc = account.toLowerCase()
  let ownNum = 0,
    mintNum = 0
  if (account != ZERO) {
    const res = await graphQuery(
      'scan',
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

export const getColls = async (
  options: CollOptions,
  pagination: Pagination = { pageSize: 5, page: 1 }
): Promise<Coll[]> => {
  let { minter, doid, tokenID } = options
  // exclude zero
  if (!minter || minter == ZERO) return []
  minter = minter.toLowerCase()
  const { tokens = [] } =
    (await graphQuery(
      'scan',
      `{tokens(${genPaging(pagination)} where:{${genWhere({ minter, tokenID })}} orderBy:createdAt orderDirection:desc){
        id tokenURI createdAt owner { id doids { name }
      }}}`
    )) || {}
  return tokens.map((token: NFTToken) => Object.assign(cookColl(token), { minter, doid }))
}

export const getColl = async (options: CollOptions): Promise<Coll | undefined> => {
  return (await getColls(options))[0]
}
