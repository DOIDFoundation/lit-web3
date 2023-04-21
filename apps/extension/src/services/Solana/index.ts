import backgroundMessenger from '~/lib.next/messenger/background'
import { Connection } from '@solana/web3.js'
import { getKeyring } from '~/lib.next/keyring'
import { AddressType, getAddress } from '~/lib.legacy/phrase'
import { unlock, autoClosePopup } from '~/middlewares'
import { ERR_NOT_IMPLEMENTED } from '~/lib.next/constants/errors'

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
  middlewares: [unlock(), autoClosePopup],
  fn: async ({ state, req, res }) => {
    const { method } = req.body
    backgroundMessenger.log(req, method)
    switch (method) {
      case 'connect':
        const { options } = req.body
        getConnection()
        const keyrings = (await getKeyring()).keyrings
        if (keyrings.length === 0) throw new Error('no keyring')
        const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
        res.body = await getAddress(mnemonic, AddressType.solana)
        break
      case 'disconnect':
        if (!res.respond) res.err = new Error(ERR_NOT_IMPLEMENTED)
        break
      case 'signAndSendTransaction':
        if (!res.respond) res.err = new Error(ERR_NOT_IMPLEMENTED)
        break
      case 'signTransaction':
        if (!res.respond) res.err = new Error(ERR_NOT_IMPLEMENTED)
        break
      case 'signAllTransaction':
        if (!res.respond) res.err = new Error(ERR_NOT_IMPLEMENTED)
        break
      case 'signMessage':
        if (!res.respond) res.err = new Error(ERR_NOT_IMPLEMENTED)
        break
    }
  }
}
