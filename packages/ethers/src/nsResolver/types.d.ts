declare type NameInfo = {
  name: string
  status: string
  owner: string
  available: boolean
  registered: boolean
  itsme: boolean
  stat: string
  locked?: boolean
  id?: `${number}`
}
declare type Commitment = {
  secret?: string
  ts?: number
}
