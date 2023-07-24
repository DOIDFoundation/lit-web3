declare interface KeyringDOID {
  [name: Address]: BaredDOID
  [address: Address]: string
}
declare interface KeyringDOIDs {
  [name: BaredDOID]: KeyringDOID
}
