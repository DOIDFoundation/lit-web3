import { Connection, Keypair } from '@solana/web3.js'

let provider: Connection
let promise: any

export const getSolanaProvider = async () => {
  if (provider) return provider
  if (!promise)
    promise = new Promise(async (resolve) => {
      provider = new Connection('https://www.sollet.io', {
        confirmTransactionInitialTimeout: 120000,
        commitment: 'confirmed'
      })
      resolve(provider)
    })
  return await promise
}
