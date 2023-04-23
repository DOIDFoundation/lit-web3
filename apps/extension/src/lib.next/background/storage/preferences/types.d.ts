declare interface VaultDOID {
  name: string
  address: Address
}
declare interface VaultDOIDs {
  [DOIDName: string]: VaultDOID