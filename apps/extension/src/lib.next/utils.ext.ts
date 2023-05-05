// src: metamask-extension/app/scripts/platforms/extension.js
import browser, { Tabs } from 'webextension-polyfill'
import emitter from '@lit-web3/core/src/emitter'
import { routerGuard } from '@lit-web3/dui/src/shared/router'

// Simple assert
export const envType = /^\/service-worker.*\.js$/.test(location.pathname)
  ? 'background'
  : window.innerWidth <= 768
  ? 'popup'
  : 'fullscreen'
export const isPopup = envType === 'popup'
export const isFullscreen = envType === 'fullscreen'
export const isBackground = envType === 'background'

export const getURLHostName = (url: string) => new URL(url).hostname || ''

export const reload = () => browser.runtime.reload()

export const openTab = async (options: Tabs.CreateCreatePropertiesType) => await browser.tabs.create(options)

export const openWindow = async (options: Tabs.CreateCreatePropertiesType) => await browser.windows.create(options)

export const focusWindow = async (windowId: number) => {
  await browser.windows.update(windowId, { focused: true })
}

export const updateWindowPosition = async (windowId: number, left: number, top: number) =>
  await browser.windows.update(windowId, { left, top })

export const getLastFocusedWindow = async () => await browser.windows.getLastFocused()

export const closeCurrentWindow = async () => {
  const windowDetails = await browser.windows.getCurrent()
  if (windowDetails.id) browser.windows.remove(windowDetails.id)
}

export const openInFullscreen = (path = '', keepSelf = false) => {
  if (isFullscreen) return emitter.emit('router-goto', path)
  openTab({ url: browser.runtime.getURL(`${routerGuard.router.path2href(path, '')}`) })
  if (!keepSelf) window.close()
}

export const addOnRemovedListener = (listener: any) => browser.windows.onRemoved.addListener(listener)

export const getAllWindows = async () => await browser.windows.getAll()

export const getAllTabs = async (opts = {}) => await browser.tabs.query(opts)

export const getActiveTabs = async () => await getAllTabs({ active: true })

export const currentTab = async () => await browser.tabs.getCurrent()

export const switchToTab = async (tabId?: number) => await browser.tabs.update(tabId, { highlighted: true })

export const closeTab = async (tabId?: number) => tabId && (await browser.tabs.remove(tabId))

export const getPlatformInfo = async () => await browser.runtime.getPlatformInfo()

export const getVersion = () => {
  const { version, version_name } = browser.runtime.getManifest()
  const versionParts = version.split('.')
  if (version_name) {
    if (versionParts.length < 4) throw new Error(`Version missing build number: '${version}'`)
    return version_name
  } else if (![3, 4].includes(versionParts.length)) {
    throw new Error(`Invalid version: ${version}`)
  } else if (versionParts[2].match(/[^\d]/u)) {
    const [major, minor, patchAndPrerelease] = versionParts
    const matches = patchAndPrerelease.match(/^(\d+)([A-Za-z]+)(\d)+$/u)
    if (matches === null) throw new Error(`Version contains invalid prerelease: ${version}`)
    const [, patch, buildType, buildVersion] = matches
    return `${major}.${minor}.${patch}-${buildType}.${buildVersion}`
  }
  return version
}

export const checkForLastError = () => {
  const { lastError } = browser.runtime
  if (!lastError) return
  if ((lastError as any).stack && lastError.message) return lastError
  return new Error(lastError.message)
}
