import { _subgraphQuery } from './graph'
import { getResolverAddress } from '@lit-web3/ethers/src/nsResolver/controller'
import { ZERO } from '@lit-web3/ethers/src/utils'
import { genWhere } from '@lit-web3/core/src/graph'
import http from '@lit-web3/core/src/http'
import { cookColl } from './collection'

const res2Json = (response: any) => {
  return response
    .json()
    .catch((err: any) => {
      throw { error: err, message: 'Malformed JSON' }
    })
    .then((res: any) => {
      var data = res.data || res.result || res
      return data
    })
}
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

export const genCollectionsQuery = ({ minter = '', slugName = '', tokenID = '', sequence = '' } = <CollOptions>{}) => {
  // slugName's priority is lower
  if (minter && tokenID && sequence) slugName = ''
  return `{
    collections(${genWhere({ artist: minter.toLowerCase(), slug: slugName }, { allowEmpty: false })}
      orderBy: totalTokens orderDirection: desc
    ) {
      id slug tokens(orderBy: createdAt, orderDirection: desc, ${genWhere(
        { collectionId: tokenID, collectionSeq: sequence },
        { allowEmpty: false }
      )}) {
        id collectionId collectionSeq tokenURI createdAt owner { id } contract {id}
      }
    }
  }`
}

export const getColls = async (options: CollOptions): Promise<Coll[]> => {
  // exclude zero
  if (options.minter == ZERO) return []
  const { collections = [] } = (await _subgraphQuery()(genCollectionsQuery(options))) || {}
  const data = await Promise.all(
    collections
      .filter((r: GraphRecord) => r.tokens.length)
      .map((r: GraphRecord) => cookColl(r))
      .flat()
      .map(async (coll: Coll) => {
        let meta: Meta = { name: '' }
        try {
          if (coll.tokenURI) meta = await http.get(coll.tokenURI)
        } catch (e) {}
        coll.meta = meta
        return coll
      })
  )
  return data
}

export const getColl = async (options: CollOptions): Promise<Coll | undefined> => {
  return (await getColls(options))[0]
}
