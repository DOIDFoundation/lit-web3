declare interface DOIDObject extends CheckedName {
  DOID?: CheckedName
  name?: string
  address?: string
  token?: NFTToken
  tokenID?: string
  sequence?: string
}
declare type DOIDish = DOIDObject | string
