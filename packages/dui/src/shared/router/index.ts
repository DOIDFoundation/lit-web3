import emitter from '@lit-web3/core/src/emitter'
import { Router } from '@lit-web3/router/src/router'
import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'
export { Router }

const bareOrigin = (url: string) => url.replace(location.origin, '')
const match = (url: any) => bareOrigin(safeDecodeURIComponent(location.href)) === bareOrigin(url)

type Pathname = `/${string}` | string

const isRelative = (s = '') => /^[^/]+:/.test(s)

export const routerPathname = (path = location.href): Pathname => {
  const inHashMode = routerGuard.hashMode
  if (!isRelative(path)) path = `blob:${inHashMode ? '#' : ''}${path}`
  const url = new URL(path)
  if (inHashMode) return url.hash.replace(/^#\/?/, '/')
  return url.pathname
}
export const routerPathroot = (pathname?: string): Pathname =>
  (pathname ?? routerPathname()).replace(/^(\/\w+)\/?.*?$/, '$1')

export const scrollTop = (y = 0) => setTimeout(() => globalThis.scrollTo(0, y))

const toDest = (pathname?: string): string => {
  pathname = routerPathname(pathname)
  return routerGuard.hashMode ? `#${pathname}` : pathname
}

// Trick for @lit-labs/router
export const routerGuard = {
  router: <Router | any>{},
  hashMode: false,
  injected: false,
  inject: (hashMode = false) => {
    routerGuard.hashMode = hashMode
    if (routerGuard.injected) return
    routerGuard.injected = true
    const { pushState, replaceState } = history
    const emitRouterChange = (url: any) => {
      setTimeout(() => {
        emitter.emit('router-change', url)
        scrollTop()
      })
    }
    // Hijack
    history.pushState = function (state, key, url) {
      pushState.apply(history, [state, key, url])
      emitRouterChange(url)
    }
    history.replaceState = function (state, key, url) {
      replaceState.apply(history, [state, key, url])
      emitRouterChange(url)
    }
    // Proto Listener
    globalThis.addEventListener('popstate', () => emitRouterChange(location.href))
    globalThis.addEventListener('pushstate', () => emitRouterChange(location.href))
    // Router Listener
    emitter.on('router-goto', (e: CustomEvent) => {
      setTimeout(() => routerGuard.goto(e.detail))
    })
    emitter.on('router-replace', (e: CustomEvent) => {
      setTimeout(() => routerGuard.replace(e.detail))
    })
  },
  goto: (url: string) => {
    if (match(url)) return
    history.pushState({}, '', url)
    routerGuard.router.goto(url)
  },
  replace: (url: string) => {
    if (match(url)) return
    history.replaceState({}, '', url)
    routerGuard.router.goto(url)
  },
  init: (_router: Router) => {
    return (routerGuard.router = _router)
  }
}

export const goto = routerGuard.goto
export const replace = routerGuard.replace
export default routerGuard
