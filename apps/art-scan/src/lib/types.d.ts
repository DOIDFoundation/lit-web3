declare interface Coll extends NFTToken {
  slugName?: string
  slugID?: string
  openseaUri?: string
  owner?: Address
  doids?: BaredDOID[]
}
declare type CollOptions = {
  name?: string
  doid?: string
  minter?: string
  slugName?: string
  tokenID?: string
  sequence?: string
}
