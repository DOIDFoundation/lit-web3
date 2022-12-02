/// <reference types="wallet" />
declare type Wallet = {
  state: WalletState
  accounts: string[]
  account: string
  updateProvider: (chainId: string) => any
  connect: () => any
  disconnect: () => any
  install: () => any
}
