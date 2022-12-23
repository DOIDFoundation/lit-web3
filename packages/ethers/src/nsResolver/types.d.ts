declare type NameInfo = {
  name: string
  owner: string
  status?: string
  registered?: boolean
  available?: boolean
  itsme?: boolean
  stat?: string
  locked?: boolean
  id?: string
  tokenID?: TokenID
  account?: string
}
declare type Commitment = {
  secret?: string
  ts?: number
}
