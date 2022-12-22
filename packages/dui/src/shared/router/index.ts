import emitter from '@lit-web3/core/src/emitter'
import type { Router } from '@lit-labs/router'

export const goto = (path: string) => {
  emitter.emit('router-goto', path)
}

export const replace = (path: string) => {
  emitter.emit('router-replace', path)
}

export const routerGuard = {
  inject: () => {
    const { pushState, replaceState } = globalThis.history
    const emitRouterChange = (url: any) => {
      url += ''
      if (location.href.replace(location.origin, '') === url.replace(location.origin, '')) return false
      setTimeout(() => {
        emitter.emit('router-change', url)
        setTimeout(() => window.scrollTo(0, 0))
      })
      return true
    }
    history.pushState = function (state, key, url) {
      if (!emitRouterChange(url)) return
      return pushState.apply(history, [state, key, url])
    }
    history.replaceState = function (state, key, url) {
      if (!emitRouterChange(url)) return
      return replaceState.apply(history, [state, key, url])
    }
  },
  goto: (url: string) => history.pushState({}, '', url),
  replace: (url: string) => history.replaceState({}, '', url),
  init: function (_router: Router) {
    emitter.on('router-goto', (e: any) => {
      history.pushState({}, '', e.detail)
      _router.goto(e.detail)
    })
    emitter.on('router-replace', (e: any) => {
      history.replaceState({}, '', e.detail)
      _router.goto(e.detail)
    })
  }
}
