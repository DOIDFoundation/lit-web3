declare interface Coll extends NFTToken {
  slugName?: string
  slugID?: string
}
declare type GraphRecord = Record<string, any>
declare type CollOptions = {
  name?: string
  doid?: string
  minter?: string
  slugName?: string
  tokenID?: string
  sequence?: string
}
