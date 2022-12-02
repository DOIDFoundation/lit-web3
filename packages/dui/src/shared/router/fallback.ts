import { Router, Routes } from '@lit-labs/router'

export const fallbackRender = () => `Not Found`

export const fallbackEnter = async (
  router: Router | Routes,
  params: { [key: string]: string | undefined }
): Promise<boolean> => {
  const path = params[0]
  // S force the function to take a microtask & Dynamically insert a new route.
  if (path) {
    // Try replace last slash, todo: check allowlist with router configs
    if (/\/$/.test(path)) {
      await router.goto('/' + path.replace(/(^\/|\/$)/g, ''))
      return false
    }
    if (path !== 'server-route') return true
    await 0
    router.routes.push({
      path: '/server-route',
      render: () => ''
    })
  }
  // E
  await router.goto('/' + (path ?? ''))
  return false
}

export { Routes }
