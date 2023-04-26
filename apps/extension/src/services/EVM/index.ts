import backgroundMessenger from '~/lib.next/messenger/background'
import { openPopup, closePopup } from '~/lib.next/background/notifier'
import { getEVMProvider } from './daemon'
import { toAscii } from 'ethereumjs-util'
import base58 from 'bs58'
import { autoClosePopup, unlock } from '~/middlewares'
export const EVM_request: BackgroundService = {
  method: 'evm_request',
  allowInpage: true,
  middlewares: [unlock(), autoClosePopup],
  fn: async (ctx) => {
    const provider = await getEVMProvider()
    const { method, params } = ctx.req.body
    console.log('method', method, 'params', params)
    // var response: any = ''
    if (method === 'eth_accounts') {
      const accounts = await provider.getSigner().address
      ctx.res.body = [accounts]
    } else if (method === 'eth_chainId') {
      const chainId = await provider.getSigner().getChainId()
      ctx.res.body = chainId
    } else if (method === 'eth_requestAccounts') {
      const accounts = await provider.getSigner().address
      ctx.res.body = [accounts]
    } else if (method === 'eth_getBalance') {
      const balance = await provider.getSigner().getBalance()
      ctx.res.body = balance
    } else if (method == 'personal_sign') {
      // ctx.res.body = await provider.getSigner().signMessage(params[0])
      const msg = toAscii(params[0])
      await openPopup(`/notification/${base58.encode(new TextEncoder().encode(msg))}`)
      backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
        if (!data) return closePopup()
        ctx.res.body = '0x' + (await provider.signMessage(msg, params[1]))
        ctx.res.responder.finally(() => {
          if (ctx.res.respond) closePopup()
        })
      })
    }
  }
}
