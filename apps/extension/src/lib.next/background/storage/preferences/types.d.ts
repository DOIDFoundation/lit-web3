// DOID Keyring
declare interface VaultDOID {
  name: string
  address: Address
}
declare interface VaultDOIDs {
  [DOIDName: string]: VaultDOID
}
// Connects
declare type ConnectedNames = string[]
declare type Connected = { names: ConnectedNames }
declare type Connects = {
  [host: string]: Connected
}
// Networks
declare type PreferNetwork = { id: ChainId }
declare type PreferNetworks = {
  [chainName in ChainName]: PreferNetwork
}
