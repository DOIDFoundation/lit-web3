import { DOIDBodyParser } from '~/middlewares'
import { ConnectsStorage } from '~/lib.next/background/storage/preferences'

export const internal_connect: BackgroundService = {
  method: 'internal_connect',
  middlewares: [DOIDBodyParser()],
  fn: async ({ req, res }) => {
    const { names, domain, chain } = req.body
    const key = `${domain}-${chain}`
    await ConnectsStorage.set(key, names.join(','))
    res.body = 'ok'
  }
}
