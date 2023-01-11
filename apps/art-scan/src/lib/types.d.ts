declare type DOID = {
  name?: string
}
declare interface CollOwner {
  id: string
  doids?: DOID[] | undefined
}
declare interface Coll extends NFTToken {
  slugName?: string
  slugID?: string
  openseaUri?: string
  owner?: CollOwner
}
declare type GraphRecord = Record<string, any>
declare type CollOptions = {
  name?: string
  minter?: string
  slugName?: string
  tokenID?: string
  sequence?: string
}
