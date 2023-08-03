import backgroundMessenger from '~/lib.next/messenger/background'
import { requestConnectedDOIDs, popupGoto, autoClosePopup } from '~/middlewares'
import { getEVMProvider } from './daemon'
import { toUtf8String } from 'ethers'
import { EVMBodyParser } from './bodyParser'
import { noAuthMethods } from './constants'

export const EVM_request: BackgroundService = {
  method: 'evm_request',
  allowInpage: true,
  middlewares: [EVMBodyParser(), autoClosePopup],
  fn: async (ctx) => {
    const { req, res, state } = ctx
    const { method, params } = req.body
    const { provider } = await getEVMProvider()

    // Pass autoClosePopup
    if (noAuthMethods.includes(method)) state.passUnlock = true
    // NoAuth methods
    if (method === 'eth_chainId') return (res.body = (await provider.getNetwork()).chainId.toString())
    if (method === 'eth_blockNumber') return (res.body = await provider.getBlockNumber())

    // Assign DOIDs
    await requestConnectedDOIDs()(ctx)
    const accounts = state.DOIDs.map((DOID: KeyringDOID) => DOID.address)

    // Both Auth/noAuth methods
    if (method === 'eth_accounts') return (res.body = accounts)

    // Auth methods
    const { wallet } = await getEVMProvider()

    switch (method) {
      case 'eth_requestAccounts':
        return (res.body = accounts)
      case 'eth_getBalance':
        const balance = await provider.getBalance(params[0])
        return (res.body = balance)
      case 'personal_sign':
        const msg = toUtf8String(params[0])
        backgroundMessenger.on('get_personal_sign', async ({ data }) => {
          return { msg, host: req.headers.host }
        })
        backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
          // if (!data) return closePopup()
          const signedMmsg = await wallet.signMessage(msg, params[1])
          res.body = signedMmsg
          // res.responder.finally(() => {
          //   if (res.respond) closePopup()
          // })
        })
        popupGoto({ path: `/notification` })
        return
      default:
        console.warn('Unkown method', method)
    }
  }
}
