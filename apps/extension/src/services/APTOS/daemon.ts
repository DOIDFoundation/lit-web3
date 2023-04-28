import { Provider, Network } from 'aptos'

let provider: any
let promise: any

export const getAptosProvider = async () => {
  if (provider) return provider
  if (!promise)
    promise = new Promise(async (resolve) => {
      const provider = new Provider(Network.DEVNET)

      resolve(provider)
    })
  return await promise
}
