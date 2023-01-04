const cookToken = (token: GraphRecord): NFTToken => {
  const {
    collectionId: tokenID,
    collectionSeq: sequence,
    contract: { id: address = '' } = {},
    tokenURI,
    owner: { id: owner = '' } = {}
  } = token
  return {
    tokenID,
    sequence,
    address,
    ctime: token.createdAt * 1000,
    tokenURI,
    owner
  }
}

export const cookColl = (coll: GraphRecord): Coll[] => {
  const { id: slugID = '', slug = '' } = coll

  return coll.tokens.map((token: GraphRecord): Coll => {
    const cooked = cookToken(token)
    const res = Object.assign(cooked, { slug, slugID, openseaUri: `/${cooked.address}/${cooked.tokenID}` })
    return res
  })
}
