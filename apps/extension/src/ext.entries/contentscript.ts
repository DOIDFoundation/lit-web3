// 1. Inject inpage.js
// 2. Event-Mux: inpage(dest: background) <-> content <-> background(dest: inpage)
import browser from 'webextension-polyfill'
import { allowWindowMessaging } from 'webext-bridge/content-script'
// @ts-expect-error
import inpage from '/public/inpage.js?script&module'
import { contentLogger } from '~/lib.next/logger'
import { NAMESPACE } from '~/lib.next/constants'

// Allow window messages (deps: in inpage.ts, `setNamespace(NAMESPACE)`)
allowWindowMessaging(NAMESPACE)

// Inject inpage.js
const inject = () => {
  if (typeof browser !== 'undefined') {
    const s = document.createElement('script')
    s.setAttribute('async', 'false')
    s.src = browser.runtime.getURL(inpage)
    s.onload = () => s.remove()
    const target = document.head || document.documentElement
    target.appendChild(s)
  }
}

// TOD: why `openStream` is not working

inject()
contentLogger('started')
