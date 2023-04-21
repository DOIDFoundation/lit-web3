declare interface VaultDOID {
  name: string
  address: Address
}
declare interface VaultDOIDs {
  [DOIDName: string]: VaultDOID
}
// declare interface Identity {
//   name: string
//   address: Address // eth address due to metamask keyring
// }
// declare interface Identities {
//   [address: Address]: Identity
// }
