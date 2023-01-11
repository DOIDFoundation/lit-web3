declare type WrappedDOID = `${string}.doid`
declare type BaredDOID = string

declare interface DOIDObject extends CheckedName {
  DOID?: CheckedName
  name?: BaredDOID
  doid?: WrappedDOID
  address?: string
  token?: NFTToken
  tokenID?: string
  sequence?: string
  error?: boolean
  msg?: string
  equal?: boolean
  uri?: string
  decoded?: string
  parsed?: DOIDObject
}
declare type DOIDish = DOIDObject | string

declare type stringifyOptions = {
  keepIdentifier: boolean
}
