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
  // fake
  const url = `https://api.opensea.io/api/v1/assets?owner=${minter}`

  const data = await new Promise((resolve, reject) => {
    fetch(`${url}`, {
      method: 'GET'
    })
      .then(res2Json)
      .then(resolve, reject)
  }).then((r: any) => {
    return r.assets?.map((item: any) => {
      const {
        creator: {
          address,
          user: { username }
        },
        token_id,
        collection: { name, description, image_url, created_date }
      } = item
      return {
        name,
        description,
        token_id,
        image: image_url,
        username,
        creator: address,
        createAt: created_date
      }
    })
  })
  return data
}

export const queryCollection = (owner: string, assetName: string, tokenId: string | number) => {}
