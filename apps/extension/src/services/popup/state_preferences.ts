import { getPreferences } from '~/lib.next/background/storage/preferences'

export const internal_isconnected: BackgroundService = {
  method: 'internal_isconnected',
  middlewares: [],
  fn: async ({ res }) => {
    const preferences = await getPreferences()
    console.log(preferences)
    // res.body = (await getPreferences()).isUnlocked
  }
}
