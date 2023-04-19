declare interface Identity {
  name: string
  address: string // eth address due to metamask keyring
  addresses: {
    EVM: string
  }
}
declare interface Identities {
  [address: string]: Identity
}
