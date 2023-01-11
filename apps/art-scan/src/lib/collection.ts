export const cookToken = (token: GraphRecord): NFTToken => {
  const { id, tokenURI } = token
  const [address, tokenID] = id ? id.toString().split('-') : [token.contract.id, token.tokenID]
  return {
    address,
    tokenID,
    ctime: token.createdAt * 1000,
    tokenURI
  }
}

export const cookColl = (token: GraphRecord): Coll => {
  const cooked = cookToken(token)
  const { owner: { id: owner = '', doids = [] } = {} } = token
  return Object.assign(cooked, { owner, doids })
}
