import backgroundMessenger from '~/lib.next/messenger/background'
import { openPopup, closePopup } from '~/lib.next/background/notifier'
import { getEVMProvider } from './daemon'
import { isHexPrefixed } from 'ethereumjs-util'
const stripHexPrefix = (str: string) => {
  if (typeof str !== 'string') {
    return str
  }
  return isHexPrefixed(str) ? str.slice(2) : str
}
const msgHexToText = (hex: string) => {
  try {
    const stripped = stripHexPrefix(hex)
    const buff = Buffer.from(stripped, 'hex')
    return buff.length === 32 ? hex : buff.toString('utf8')
  } catch (e) {
    return hex
  }
}
export const EVM_request: BackgroundService = {
  method: 'evm_request',
  allowInpage: true,
  middlewares: [],
  fn: async (ctx) => {
    console.log(ctx, 'ctx')

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
      await openPopup(`/notification/${params[0]}/${ctx.req.headers.origin}`)
      backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
        console.log(data, 'signMessage')
        if (!data) return closePopup()
        const msg = msgHexToText(params[0])
        ctx.res.body = await provider.signMessage(msg, params[1])
        ctx.res.responder.finally(() => {
          if (ctx.res.respond) closePopup()
        })
      })
    }
  }
}
