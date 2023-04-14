// import backgroundMessenger from '~/lib.next/messenger/background'
import ipfsHelper from '~/lib.next/ipfsHelper'

export const DOID_chain_address: BackgroundService = {
  method: 'DOID_chain_address',
  middlewares: [],
  fn: async (ctx) => {
    const { key, cid } = ctx.req.body
    try {
      const { addrs } = await ipfsHelper.readJsonData({ cid })
      ctx.res.body = addrs
    } catch (e) {
      console.error('err:', e)
      ctx.res.body = e
    }
  }
}
