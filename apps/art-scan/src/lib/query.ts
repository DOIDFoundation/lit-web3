import { _subgraphQuery } from './graph'
import { getResolverAddress } from '@lit-web3/ethers/src/nsResolver/controller'
import { ZERO } from '@lit-web3/ethers/src/utils'
import { genWhere } from '@lit-web3/core/src/graph'
import http from '@lit-web3/core/src/http'
import { cookColl } from './collection'
import { normalizeUri } from '@lit-web3/core/src/uri'

// artist hodls
export const queryHoldlNums = async (account: string) => {
  const contractAddr = await getResolverAddress()
  const _account = account.toLowerCase()
  let ownNum = 0,
    mintNum = 0
  if (account != ZERO) {
    const res = await _subgraphQuery()(
      `{
        owns: tokens(
          orderBy: createdAt
          orderDirection: desc
          where: {collection_not_contains: "${contractAddr}" owner:"${_account}"}
        ) {id
        }
        mints: tokens(
          orderBy: createdAt
          orderDirection: desc
          where: {collection_not_contains: "${contractAddr}" minter:"${_account}"}) {
          id
        }
      }`
    )
    const { owns = [], mints = [] } = res
    ownNum = owns.length
    mintNum = mints.length
  }
  return { ownNum, mintNum }
}

export const genCollectionsQuery = (minter = '', slug = '', tokenId = '', seq = '') => {
  const _minter = minter.toLowerCase()
  return `{
    collections(orderBy: totalTokens orderDirection: desc
      ${genWhere({ artist: _minter, slug }, { allowEmpty: false })}
    ) {
      id slug tokens(orderBy: createdAt orderDirection: desc ${genWhere(
        {
          collectionId: tokenId,
          collectionSeq: seq
        },
        { allowEmpty: false }
      )}) {
        id collectionId collectionSeq tokenURI createdAt owner { id } contract {id}
      }
    }
  }`
}

export const getColls = async (minter = '', slug = '', tokenID = '', seq = ''): Promise<Coll[]> => {
  // exclude zero
  if (minter == ZERO) return []
  const _minter = `${minter.toLowerCase()}`
  const { collections = [] } = (await _subgraphQuery()(genCollectionsQuery(_minter, slug, tokenID, seq))) || {}
  const data = await Promise.all(
    collections
      .filter((r: GraphRecord) => r.tokens.length)
      .map((r: GraphRecord) => cookColl(r))
      .flat()
      .map(async (coll: Coll) => {
        let meta: Meta = { name: '' }
        try {
          const uri = normalizeUri(coll.tokenURI)
          if (uri) meta = await http['get'](uri)
        } catch (e) {}
        coll.meta = meta
        return coll
      })
  )
  return data
}

export const getColl = async (...args: any[]): Promise<Coll | undefined> => {
  return (await getColls(...args))[0]
}
