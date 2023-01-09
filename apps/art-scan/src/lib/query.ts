import { ZERO } from '@lit-web3/ethers/src/utils'
import { genWhere, genPaging } from '@lit-web3/core/src/graph'
import { _subgraphQuery } from './graph'
import { cookColl } from './collection'

// artist hodls
export const queryHoldlNums = async (account: string) => {
  const _account = account.toLowerCase()
  let ownNum = 0,
    mintNum = 0
  if (account != ZERO) {
    const res = await _subgraphQuery()(
      `{
        owns: tokens(
          orderBy: createdAt
          orderDirection: desc
          where: {owner_: {id: "${_account}"}}
        ) {
          id
        }
        mints: tokens(
          orderBy: createdAt
          orderDirection: desc
          where: {artist: "${_account}"}
        ) {
          id collection {id}
        }
      }`
    )
    const { owns = [], mints = [] } = res
    ownNum = owns.length
    mintNum = mints.length
  }
  return { ownNum, mintNum }
}

export const genCollectionsQuery = (
  { minter = '', slugName = '', tokenID = '', sequence = '' } = <CollOptions>{},
  pagination?: Pagination
) => {
  // slugName's priority is lower
  if (minter && tokenID && sequence) slugName = ''
  return `{
    collections(${genPaging(pagination)} ${genWhere(
    { artist: minter.toLowerCase(), slug: slugName },
    { allowEmpty: false }
  )}
      orderBy: totalTokens orderDirection: desc
    ) {
      id slug tokens(orderBy: createdAt, orderDirection: desc, ${genWhere(
        {
          collectionId: tokenID,
          collectionSeq: sequence
        },
        { allowEmpty: false }
      )}) {
        id collectionId collectionSeq tokenURI createdAt owner { id } contract {id}
      }
    }
  }`
}

export const getColls = async (
  options: CollOptions,
  pagination: Pagination = { pageSize: 5, page: 1 }
): Promise<Coll[]> => {
  // exclude zero
  if (options.minter == ZERO) return []
  const { collections = [] } = (await _subgraphQuery()(genCollectionsQuery(options, pagination))) || {}
  return collections
    .filter((r: GraphRecord) => r.tokens.length)
    .map((r: GraphRecord) => cookColl(r))
    .flat()
}

export const getColl = async (options: CollOptions): Promise<Coll | undefined> => {
  return (await getColls(options))[0]
}
