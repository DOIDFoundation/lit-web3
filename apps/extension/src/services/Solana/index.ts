import backgroundMessenger from '~/lib.next/messenger/background'
import { Keypair } from '@solana/web3.js'
import { getKeyring } from '~/lib.next/keyring'
import { AddressType, getAddress } from '~/lib.next/keyring/phrase'
import { unlock, autoClosePopup } from '~/middlewares'
import { ERR_NOT_IMPLEMENTED, ERR_USER_DENIED } from '~/lib.next/constants/errors'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import { mnemonicToSeed } from 'ethereum-cryptography/bip39'
import { derivePath } from 'ed25519-hd-key'
import { getSolanaProvider } from './daemon'
import { openPopup } from '~/lib.next/background/notifier'

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
        const provider = await getSolanaProvider()
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
        await openPopup(`/notification/${message}`)
        backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
          if (!data) {
            res.err = new Error(ERR_USER_DENIED)
            return
          }
          const keyrings = (await getKeyring()).keyrings
          if (keyrings.length === 0) throw new Error('no keyring')
          const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
          let seed = await mnemonicToSeed(mnemonic)
          const derivedSeed = derivePath(`m/44'/501'/0'/0'`, Buffer.from(seed).toString('hex')).key
          const keypair = Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey)
          const decodedMsg = base58.decode(message)
          res.body = base58.encode(nacl.sign.detached(decodedMsg, keypair.secretKey))
        })
        break
      }
    }
  }
}
