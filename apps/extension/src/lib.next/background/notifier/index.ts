// src: metamask-extension/app/scripts/lib/notification-manager
import browser from 'webextension-polyfill'
import { popupStore } from '~/lib.next/background/storage/popupStore'
import emitter from '@lit-web3/core/src/emitter'

export const POPUP_HEIGHT = 620
export const POPUP_WIDTH = 360

let uiIsTriggering = false

export const getPopup = async (): Promise<any> => {
  const windows = await browser.windows.getAll()
  if (!windows?.length) return
  return windows.find((win) => win && win.type === 'popup' && win.id === popupStore._popupId)
}

export const openPopup = async (url?: string): Promise<void> => {
  const tabs = await browser.tabs.query({ active: true })
  const currentlyActived = tabs.some(({ id }) => id && popupStore.openTabsIDs[id])
  if (!uiIsTriggering && !popupStore.isOpen && !currentlyActived) {
    uiIsTriggering = true
    try {
      await showPopup(popupStore.currentPopupId, url)
    } catch {}
    uiIsTriggering = false
  }
}

export const closePopup = async () => {
  if (popupStore._popupId) browser.windows.remove(popupStore._popupId as number)
}

const showPopup = async (currentPopupId?: number, url = '/'): Promise<any> => {
  if (currentPopupId) popupStore._popupId = currentPopupId
  const popup = await getPopup()
  if (popup?.id) return await browser.windows.update(popup.id, { focused: true })
  //
  let left = 0
  let top = 0
  try {
    const { top: _top = 0, left: _left = 0, width: _width = 0 } = await browser.windows.getLastFocused()
    top = _top + 7
    left = _left + (_width - POPUP_WIDTH)
  } catch (_) {
    const { screenX, screenY, outerWidth } = window
    top = Math.max(screenY, 0)
    left = Math.max(screenX + (outerWidth - POPUP_WIDTH), 0)
  }
  const popupWindow = await browser.windows.create({
    url,
    type: 'popup',
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    left,
    top
  })
  const { id: popupId = 0 } = popupWindow
  // Firefox currently ignores left/top for create, but it works for update
  if (popupWindow.left !== left && popupWindow.state !== 'fullscreen') {
    await browser.windows.update(popupId, { left, top })
  }
  popupStore.currentPopupId = popupId
  popupStore._popupId = popupId
}

// onWindowClosed
browser.windows.onRemoved.addListener((windowId: number) => {
  if (windowId !== popupStore._popupId) return
  popupStore.currentPopupId = undefined
  popupStore._popupId = undefined
  emitter.emit('popup_closed', {
    automaticallyClosed: popupStore._popupAutomaticallyClosed
  })
  // process unapprovals
  // if (!popupStore._popupAutomaticallyClosed) {
  //   rejectUnapprovedNotifications();
  // } else if (getUnapprovedTransactionCount() > 0) {
  //   triggerUi();
  // }
  popupStore._popupAutomaticallyClosed = undefined
})

export default {
  openPopup
}
