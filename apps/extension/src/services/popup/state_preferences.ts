import { getPreferences } from '~/lib.next/background/storage/preferences'

export const internal_preferences: BackgroundService = {
  method: 'internal_preferences',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = await getPreferences()
  }
}
