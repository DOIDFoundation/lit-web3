import backgroundMessenger from '~/lib.next/messenger/background'
import { Keypair as SolanaKeyPair } from '@solana/web3.js'
import { getKeyring } from '~/lib.next/keyring'
import { AddressType } from '~/lib.next/keyring/phrase'
import { unlock, autoClosePopup } from '~/middlewares'
import { ERR_NOT_IMPLEMENTED, ERR_USER_DENIED } from '~/lib.next/constants/errors'
import nacl from 'tweetnacl'
import { derivePath } from 'ed25519-hd-key'
import { getSolanaProvider } from './daemon'
import { openPopup } from '~/lib.next/background/notifier'
import { Mnemonic, decodeBase58, encodeBase58, toBeArray } from 'ethers'

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
        const keyring = await getKeyring()
        res.body = await keyring.getMultiChainAddress(AddressType.solana)
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
        const {
          body: { message },
          headers: { host }
        } = req
        await openPopup(`/notification/${message}/${host}`)
        backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
          if (!data) {
            res.err = new Error(ERR_USER_DENIED)
            return
          }
          const keyring = await getKeyring()
          const mnemnoic = Mnemonic.fromPhrase(keyring.phrase)
          const seed = mnemnoic.computeSeed()
          const solanaKeypair = SolanaKeyPair.fromSeed(derivePath(`m/44'/501'/0'/0'`, seed.replace(/^0x/, '')).key)

          const decodedMsg = decodeBase58(message)
          // TODO: Can we use ethers instead of nacl?
          res.body = encodeBase58(nacl.sign.detached(toBeArray(decodedMsg), solanaKeypair.secretKey))
        })
        break
      }
    }
  }
}
