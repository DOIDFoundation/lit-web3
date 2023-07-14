import backgroundMessenger from '~/lib.next/messenger/background'
import { requestUnlock, autoClosePopup } from '~/middlewares'
import { openPopup, closePopup } from '~/lib.next/background/notifier'
import { getEVMProvider } from './daemon'
import { toUtf8String } from 'ethers'
import { getKeyring } from '~/lib.next/keyring'
import { sleep } from '@lit-web3/ethers/src/utils'

export const EVM_request: BackgroundService = {
  method: 'evm_request',
  allowInpage: true,
  middlewares: [autoClosePopup],
  fn: async (ctx) => {
    const { req, res, state } = ctx
    const { method, params } = req.body
    const { isUnlocked } = await getKeyring()

    if (!isUnlocked && !['eth_chainId', 'eth_blockNumber', 'eth_accounts'].includes(method)) {
      await requestUnlock(ctx)
    }

    const { wallet, provider } = await getEVMProvider()
    const account = wallet?.address

    switch (method) {
      // Unauthed req
      case 'eth_chainId':
        return (res.body = (await provider.getNetwork()).chainId.toString())
      case 'eth_blockNumber':
        return (res.body = await provider.getBlockNumber())
      // Half-authed req
      case 'eth_accounts':
        return (res.body = isUnlocked ? [account] : [])
      // Authed req
      case 'eth_requestAccounts':
        return (res.body = [account])
      case 'eth_getBalance':
        const balance = await provider.getBalance(params[0])
        return (res.body = balance)
      case 'personal_sign':
        const msg = toUtf8String(params[0])
        backgroundMessenger.on('get_personal_sign', async ({ data }) => {
          return { msg, origin: req.headers.origin }
        })
        backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
          if (!data) return closePopup()
          const signedMmsg = await wallet.signMessage(msg, params[1])
          res.body = signedMmsg
          // res.responder.finally(() => {
          //   if (res.respond) closePopup()
          // })
        })
        openPopup(`/notification`)
        return
      default:
        console.warn('Unkown method', method)
    }
  }
}
