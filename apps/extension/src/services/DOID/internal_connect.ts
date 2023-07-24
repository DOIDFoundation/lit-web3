import { DOIDBodyParser } from '~/middlewares'
import { ConnectsStorage } from '~/lib.next/background/storage/preferences'

export const internal_connect: BackgroundService = {
  method: 'internal_connect',
  middlewares: [DOIDBodyParser()],
  fn: async ({ req, res }) => {
    const { names, host } = req.body
    await ConnectsStorage.set(host, names)
    res.body = 'ok'
  }
}
