declare type NameInfo = {
  name: string
  owner?: string
  status?: string
  registered?: boolean
  available?: boolean
  itsme?: boolean
  stat?: string
  locked?: boolean
  id?: string
  tokenID?: TokenID
  account?: string
  mainAddress?: string
  publicKey?: string
}
declare type Commitment = {
  secret?: string
  ts?: number
  sent?: boolean
  success?: boolean
}

declare type CheckNameOptions = {
  allowAddress?: boolean
  len?: number
  wrap?: boolean
}
declare type CheckedName = {
  name?: string
  address?: string
  val?: string // name or address
  doid?: string
  error?: boolean
  msg?: string
  length?: number
  equal?: boolean
}
