import emitter from '@lit-web3/core/src/emitter'
import type { Router } from '@lit-labs/router'

const bareOrigin = (url: string) => url.replace(location.origin, '')
const match = (url: any) => bareOrigin(location.href) === bareOrigin(url)

export const scrollTop = (y = 0) => setTimeout(() => window.scrollTo(0, y))

// Trick for @lit-labs/router
export const routerGuard = {
  router: <Router | any>{},
  injected: false,
  inject: () => {
    if (routerGuard.injected) return
    routerGuard.injected = true
    const { pushState, replaceState } = history
    const emitRouterChange = (url: any) => {
      setTimeout(() => {
        emitter.emit('router-change', url)
        scrollTop()
      })
    }
    history.pushState = function (state, key, url) {
      pushState.apply(history, [state, key, url])
      emitRouterChange(url)
    }
    history.replaceState = function (state, key, url) {
      replaceState.apply(history, [state, key, url])
      emitRouterChange(url)
    }
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
    routerGuard.router = _router
  }
}

export const goto = routerGuard.goto
export const replace = routerGuard.replace
export default routerGuard
