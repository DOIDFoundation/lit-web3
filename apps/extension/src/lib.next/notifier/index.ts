// src: metamask-extension//app/scripts/lib/notification-manager
import browser from 'webextension-polyfill'

export const POPUP_HEIGHT = 620
export const POPUP_WIDTH = 360

type SetCurrentPopupIdFn = (popupId?: PopupId) => void
type PopupId = number | undefined
export const popupState = {
  _popupId: undefined as PopupId,
  isOpen: false,
  _popupAutomaticallyClosed: undefined,
  _setCurrentPopupIdFn: () => {} // TODO: autosave
}

export const getPopup = async (): Promise<any> => {
  const windows = await browser.windows.getAll()
  if (!windows?.length) return
  return windows.find((win) => win && win.type === 'popup' && win.id === popupState._popupId)
}

export const openPopup = async () => {
  const tabs = await browser.tabs.query({ active: true })
  const { controller, openMetamaskTabsIDs, popupIsOpen } = swGlobal
  const currentlyActiveMetamaskTab = Boolean(tabs.find((tab) => openMetamaskTabsIDs[tab.id]))
  // Vivaldi is not closing port connection on popup close, so popupIsOpen does not work correctly
  // To be reviewed in the future if this behaviour is fixed - also the way we determine isVivaldi variable might change at some point
  const isVivaldi = tabs.length > 0 && tabs[0].extData && tabs[0].extData.indexOf('vivaldi_tab') > -1
  if (!swGlobal.uiIsTriggering && (isVivaldi || !popupIsOpen) && !currentlyActiveMetamaskTab) {
    swGlobal.uiIsTriggering = true
    try {
      const currentPopupId = controller.appStateController.getCurrentPopupId()
      await notificationManager.showPopup(
        (newPopupId) => controller.appStateController.setCurrentPopupId(newPopupId),
        currentPopupId
      )
    } finally {
      swGlobal.uiIsTriggering = false
    }
  }
}

export const showPopup = async (_setCurrentPopupIdFn?: SetCurrentPopupIdFn, currentPopupId?: number): Promise<any> => {
  if (currentPopupId) popupState._popupId = currentPopupId
  if (_setCurrentPopupIdFn) popupState._setCurrentPopupIdFn = _setCurrentPopupIdFn
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
    url: '/',
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
  if (_setCurrentPopupIdFn) _setCurrentPopupIdFn(popupId)
  popupState._popupId = popupId
}

// onWindowClosed
browser.windows.onRemoved.addListener((windowId: number) => {
  if (windowId !== popupState._popupId) return
  popupState._setCurrentPopupIdFn()
  popupState._popupId = undefined
  // process unapprovals
  // if (!popupState._popupAutomaticallyClosed) {
  //   rejectUnapprovedNotifications();
  // } else if (getUnapprovedTransactionCount() > 0) {
  //   triggerUi();
  // }
  popupState._popupAutomaticallyClosed = undefined
})

export default {
  showPopup
}
