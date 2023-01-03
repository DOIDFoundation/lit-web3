import { subgraphQuery } from './graph'
import { getResolverAddress } from '@lit-web3/ethers/src/nsResolver/controller'
import { ZERO } from '@lit-web3/ethers/src/utils'
import { getOpensea, getNetwork } from '@lit-web3/ethers/src/useBridge'

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
    await subgraphQuery()(
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
      .then(res2Json)
      .then(async (data: any) => {
        const { owns, mints } = data
        ownNum = owns.length
        mintNum = mints.length
      })
  }
  return { ownNum, mintNum }
}
// collections by owner
export const queryCollectionsByOwner = async (minter: string) => {
  const contractAddr = await getResolverAddress()
  if (minter == ZERO) {
    return []
  }
  const data = await new Promise((resolve, reject) => {
    const _minter = `${minter.toLowerCase()}`
    return subgraphQuery()(
      `{
        tokens(orderBy: createdAt,orderDirection: desc, where: {minter: "${_minter}" collection_not_contains:"${contractAddr}"}) {
          id
          createdAt
          tokenID
          owner {
            id
          }
          collection {
            id
            name
            tokens {
              id tokenURI tokenID tokenURI
            }
          }
        }
      }`
    )
      .then(res2Json)
      .then(async (data: any) => {
        const _data = data.tokens.map((r: any) => {
          let tokenId = '',
            tokenUri = ''
          const { id: _id } = r
          r.collection.tokens.forEach(({ id, tokenID: token_id, tokenURI: token_uri }: any) => {
            if (id == _id) {
              tokenId = token_id
              tokenUri = token_uri
            }
          })
          return { ...r, tokenId, tokenUri }
        })
        // meta json
        await Promise.all(
          _data.map(async (r: any) => {
            const { image_url, name, description, external_url }: any = await fetch(r.tokenUri, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', accept: 'application/json, */*' }
            }).then(res2Json)
            r.meta = { image_url, name, description, external_url }
          })
        )

        return _data
      })
      .then(resolve, reject)
  })
  return data
}
// collection unique
export const queryCollection = async (
  itemName: string,
  tokenId: string | number,
  minter: string,
  seq?: string | number
) => {
  if (minter == ZERO) {
    return []
  }
  const data = await new Promise((resolve, reject) => {
    const _minter = `${minter.toLowerCase()}`
    return subgraphQuery()(
      `{
        collections(where: {name:"${itemName}" }) {
        id
        name
        tokens(where: {tokenID: "${tokenId}", minter: "${_minter}"}) {
          minter {
            id
          }
          owner {
            id createdAt
          }
          id
          tokenURI
          tokenID
        }
      }
    }`
    )
      .then(res2Json)
      .then(async (data: any) => {
        const _data = data.collections.map((r: any) => {
          let tokenId = '',
            tokenUri = '',
            ownerId = '',
            minterId = ''
          const { id: _id } = r
          r.tokens.forEach(({ id, tokenID: token_id, tokenURI: token_uri, owner, minter }: any) => {
            if (id.includes(_id)) {
              tokenId = token_id
              tokenUri = token_uri
              ownerId = owner.id
              minterId = minter.id
            }
          })
          return { ...r, tokenId, tokenUri, minter: minterId, owner: ownerId }
        })
        // meta json
        await Promise.all(
          _data.map(async (r: any) => {
            const { image_url, name, description, external_url }: any = await fetch(r.tokenUri, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', accept: 'application/json, */*' }
            }).then(res2Json)
            r.meta = { image_url, name, description, external_url }
            const url = await getOpensea(`/${r.id}/${tokenId}`)
            r.marketplace = {
              title: new URL(url).origin,
              url
            }
            r.contractUrl = ((await getNetwork()).scan ?? '') + `/address/${r.id}`
          })
        )
        return _data
      })
      .then(resolve, reject)
  })
  return data
}
