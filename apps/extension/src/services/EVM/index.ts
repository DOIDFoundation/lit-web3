import backgroundMessenger from '~/lib.next/messenger/background'
import { openPopup, closePopup } from '~/lib.next/background/notifier'
import { getEVMProvider } from './daemon'

export const EVM_request: BackgroundService = {
  method: 'evm_request',
  allowInpage: true,
  middlewares: [],
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
      backgroundMessenger.send('popup_personal_sign', params[0])
      openPopup('/notification')
      backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
        console.log(data, 'signMessage')
        ctx.res.body = await provider.getSigner().signMessage(params[0])
      })
      // console.log(response, 'person')
    }
    // ctx.res.body = response
  }
}
