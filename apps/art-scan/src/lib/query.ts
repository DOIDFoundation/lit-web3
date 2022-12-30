import { subgraphQuery } from './graph'
import { getResolverAddress } from '@lit-web3/ethers/src/nsResolver/controller'
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
export const queryHoldlNums = async (account: string) => {
  const contractAddr = await getResolverAddress()
  const _account = account.toLowerCase()
  return subgraphQuery()(
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
      return {
        owns: owns.length,
        mints: mints.length
      }
    })
}
export const queryCollectionsByOwner = async (minter: string) => {
  const contractAddr = await getResolverAddress()
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

export const queryCollection = (owner: string, assetName: string, tokenId: string | number) => {}
