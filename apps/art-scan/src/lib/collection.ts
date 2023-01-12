import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'

export const cookToken = (token: Record<string, any>): NFTToken => {
  const { id, tokenURI } = token
  const [address, tokenID] = id ? id.toString().split('-') : [token.contract.id, token.tokenID]
  return {
    address,
    tokenID,
    ctime: token.createdAt * 1000,
    tokenURI
  }
}

export const cookColl = (token: Record<string, any>): Coll => {
  const cooked = cookToken(token)
  const { owner: { id: owner = '', doids = [] } = {} } = token
  return Object.assign(cooked, {
    owner,
    doids: doids.map((doid: any) => {
      return { ...doid, name: wrapTLD(doid.name) }
    })
  })
}
