interface options {
  location: string
  registerOnboarding: Function
}
type fn = (req: any, res: any, next: Function, end: Function) => void
export const createOnboardingMiddleware = function ({ location, registerOnboarding } = <options>{}): fn {
  return async function originMiddleware(req, res, next, end) {
    try {
      if (req.method !== 'wallet_registerOnboarding') {
        next()
        return
      }
      if (req.tabId && req.tabId !== chrome.tabs.TAB_ID_NONE) {
        await registerOnboarding(location, req.tabId)
      } else {
        console.error(`'wallet_registerOnboarding' message from ${location} ignored due to missing tabId`)
      }
      res.result = true
      end()
    } catch (error) {
      end(error)
    }
  }
}
