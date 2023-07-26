declare interface VaultDOID {
  name: string
  address: Address
}
declare interface VaultDOIDs {
  [DOIDName: string]: VaultDOID
}

declare type ConnectedNames = string[]
declare type Connected = { names: ConnectedNames }
declare type Connects = {
  [host: string]: Connected
}
