declare interface DOIDObject extends CheckedName {
  DOID?: CheckedName
  name?: string
  address?: string
  token?: NFTToken
  tokenID?: string
  sequence?: string
  error?: boolean
  msg?: string
  equal?: boolean
  uri?: string
}
declare type DOIDish = DOIDObject | string

declare type stringifyOptions = {
  keepIdentifier: boolean
}
