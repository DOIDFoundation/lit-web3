import backgroundMessenger from '~/lib.next/messenger/background'
import { Connection, Keypair } from '@solana/web3.js'
import { getKeyring } from '~/lib.next/keyring'
import { AddressType, getAddress } from '~/lib.next/keyring/phrase'
import { unlock, autoClosePopup } from '~/middlewares'
import { ERR_NOT_IMPLEMENTED } from '~/lib.next/constants/errors'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import { mnemonicToSeed } from 'ethereum-cryptography/bip39'
import { derivePath } from 'ed25519-hd-key'

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
      case 'connect': {
        const { options } = req.body
        getConnection()
        const keyrings = (await getKeyring()).keyrings
        if (keyrings.length === 0) throw new Error('no keyring')
        const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
        res.body = await getAddress(mnemonic, AddressType.solana)
        break
      }
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
      case 'signMessage': {
        const { message } = req.body
        const keyrings = (await getKeyring()).keyrings
        if (keyrings.length === 0) throw new Error('no keyring')
        const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
        let seed = await mnemonicToSeed(mnemonic)
        const derivedSeed = derivePath(`m/44'/501'/0'/0'`, Buffer.from(seed).toString('hex')).key
        const keypair = Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey)
        const decodedMsg = base58.decode(message)
        res.body = base58.encode(nacl.sign.detached(decodedMsg, keypair.secretKey))
        break
      }
    }
  }
}
