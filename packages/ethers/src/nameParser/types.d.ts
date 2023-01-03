declare interface DOIDObject extends CheckedName {
  DOID?: CheckedName
  name?: string
  address?: string
  token?: NFTToken
  tokenID?: string
  sequence?: string
  error?: boolean
  msg?: string
  consistent?: boolean
}
declare type DOIDish = DOIDObject | string
