import { subgraphQuery } from './graph'
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
export const queryCollectionsByOwner = async (minter: string) => {
  const data = await new Promise((resolve, reject) => {
    const _minter = `${minter.toLowerCase()}`
    return subgraphQuery()(
      `{
        tokens(orderBy: createdAt,orderDirection: desc, where: {minter: "${_minter}"}) {
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
