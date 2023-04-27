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
const isHex = (str: string) => {
  return Boolean(str.match(/^[0-9a-f]+$/i))
}
const hexToAscii = (hex: string) => {
  hex = hex.replace('0x', '')
  if (!isHex(hex)) return hex

  let str = ''
  for (let i = 0; i < hex.length; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16)
    str += String.fromCharCode(code)
  }
  return str
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
      const msg = hexToAscii(params[0])
      backgroundMessenger.on('get_personal_sign', async ({ data }) => {
        return { msg, origin: ctx.req.headers.origin }
      })
      backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
        if (!data) return closePopup()
        const signmsg = await provider.signMessage(msg, params[1])
        ctx.res.body = signmsg.toString().startsWith('0x') ? signmsg : '0x' + signmsg
        ctx.res.responder.finally(() => {
          if (ctx.res.respond) closePopup()
        })
      })
      openPopup(`/notification`)
    }
  }
}
