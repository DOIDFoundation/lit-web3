/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Routes } from './routes.js'

// We cache the origin since it can't change
const origin = location.origin || location.protocol + '//' + location.host

/**
 * A root-level router that installs global event listeners to intercept
 * navigation.
 *
 * This class extends Routes so that it can also have a route configuration.
 *
 * There should only be one Router instance on a page, since the Router
 * installs global event listeners on `window` and `document`. Nested
 * routes should be configured with the `Routes` class.
 */
export class Router extends Routes {
  override hostConnected() {
    super.hostConnected()
    window.addEventListener('click', this._onClick)
    window.addEventListener('popstate', this._onPopState)
    // Kick off routed rendering by going to the current URL
    const { pathname, search, hash } = location
    this.goto(`${pathname}${search}${hash}`)
  }

  override hostDisconnected() {
    super.hostDisconnected()
    window.removeEventListener('click', this._onClick)
    window.removeEventListener('popstate', this._onPopState)
  }

  private _onClick = (e: MouseEvent) => {
    const isNonNavigationClick = e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey
    if (e.defaultPrevented || isNonNavigationClick) {
      return
    }

    const anchor = e.composedPath().find((n) => (n as HTMLElement).tagName === 'A') as HTMLAnchorElement | undefined
    if (
      anchor === undefined ||
      anchor.target !== '' ||
      anchor.hasAttribute('download') ||
      anchor.getAttribute('rel') === 'external'
    ) {
      return
    }

    const href = anchor.href
    if (href === '' || href.startsWith('mailto:')) {
      return
    }

    if (anchor.origin !== origin) {
      return
    }

    e.preventDefault()
    if (href !== location.href) {
      window.history.pushState({}, '', href)
      const { pathname, search, hash } = anchor
      this.goto(`${pathname}${search}${hash}`)
    }
  }

  private _onPopState = (_e: PopStateEvent) => {
    const { pathname, search, hash } = location
    this.goto(`${pathname}${search}${hash}`)
  }
}
