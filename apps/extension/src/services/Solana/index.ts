import backgroundMessenger from '~/lib.next/messenger/background'
import { openPopup, closePopup } from '~/lib.next/background/notifier'
import { Connection } from '@solana/web3.js'
import { getKeyringController } from '~/lib.next/keyring'
import { AddressType, getAddress } from '~/lib.legacy/phrase'

let connection: Connection
let promise: any
const getConnection = async () => {
  if (connection) return connection
  if (!promise)
    promise = new Promise(async (resolve) => {
      connection = new Connection('https://www.sollet.io', {
        confirmTransactionInitialTimeout: 120000,
        commitment: 'confirmed'
      })

      resolve(connection)
    })
  return await promise
}

export const solana_request: BackgroundService = {
  method: 'solana_request',
  allowInpage: true,
  middlewares: [],
  fn: async ({ state, req, res }) => {
    const { method } = req.body
    backgroundMessenger.log(req, method)
    switch (method) {
      case 'connect': {
        const { options } = req.body
        getConnection()
        const keyrings = (await getKeyringController()).keyrings
        if (keyrings.length === 0) throw new Error('no keyring')
        const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
        res.body = await getAddress(mnemonic, AddressType.solana)
        break
      }
      case 'disconnect':
        break
      case 'signAndSendTransaction':
        break
      case 'signTransaction':
        break
      case 'signAllTransaction':
        break
      case 'signMessage':
        break
    }
  }
}
