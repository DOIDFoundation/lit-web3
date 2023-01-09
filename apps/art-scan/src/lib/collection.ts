export const cookToken = (token: GraphRecord): NFTToken => {
  const { id, tokenURI, owner: { id: owner = '' } = {} } = token
  const [address, tokenID] = id ? id.toString().split('-') : [token.contract.id, token.tokenID]
  return {
    address,
    tokenID,
    ctime: token.createdAt * 1000,
    tokenURI,
    owner
  }
}

export const cookColl = (token: GraphRecord): Coll => {
  const cooked = cookToken(token)
  return Object.assign(cooked, { openseaUri: `/${cooked.address}/${cooked.tokenID}` })
}
