declare interface VaultOwner {
  [DOIDName: string]: Address
}
declare interface Identity {
  DOIDName: string
  address: string // eth address due to metamask keyring
}
declare interface Identities {
  [address: string]: Identity
}
