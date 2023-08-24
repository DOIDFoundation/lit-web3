// S Watch this: https://github.com/solana-labs/solana-web3.js/issues/1100
import '@lit-web3/core/src/shims/node/buffer.sync'
// E
export { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
export type { SendOptions } from '@solana/web3.js'
