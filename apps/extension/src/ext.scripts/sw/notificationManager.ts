import EventEmitter from '@metamask/safe-event-emitter'
import { REJECT_NOTFICIATION_CLOSE, REJECT_NOTFICIATION_CLOSE_SIG } from '~/constants/metametrics'
import { SECOND } from '@lit-web3/core/src/constants/time'
import { ethErrors } from 'eth-rpc-errors'
import ExtensionPlatform from '~/lib/keyringController.setup/platform'
import swGlobal from './swGlobal'

const NOTIFICATION_HEIGHT = 620
const NOTIFICATION_WIDTH = 360

export const NOTIFICATION_MANAGER_EVENTS = {
  POPUP_CLOSED: 'onPopupClosed'
}

/**
 * A collection of methods for controlling the showing and hiding of the notification popup.
 */
export default class NotificationManager extends EventEmitter {
  platform: any
  _popupAutomaticallyClosed: any
  _popupId: any
  _setCurrentPopupId: Function = () => {}
  constructor() {
    super()
    this.platform = new ExtensionPlatform()
    this.platform.addOnRemovedListener(this._onWindowClosed.bind(this))
  }

  /**
   * Mark the notification popup as having been automatically closed.
   *
   * This lets us differentiate between the cases where we close the
   * notification popup v.s. when the user closes the popup window directly.
   */
  markAsAutomaticallyClosed() {
    this._popupAutomaticallyClosed = true
  }

  /**
   * Either brings an existing MetaMask notification window into focus, or creates a new notification window. New
   * notification windows are given a 'popup' type.
   *
   * @param {Function} setCurrentPopupId - setter of current popup id from appStateController
   * @param {number} currentPopupId - id of current opened metamask popup window
   */
  async showPopup(setCurrentPopupId: Function, currentPopupId: number) {
    this._popupId = currentPopupId
    this._setCurrentPopupId = setCurrentPopupId
    const popup = await this._getPopup(currentPopupId)
    // Bring focus to chrome popup
    if (popup) {
      // bring focus to existing chrome popup
      await this.platform.focusWindow(popup.id)
    } else {
      // create new notification popup
      let left = 0
      let top = 0
      try {
        const lastFocused = await this.platform.getLastFocusedWindow()
        // Position window in top right corner of lastFocused window.
        top = lastFocused.top + 7
        left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH)
      } catch (_) {
        // The following properties are more than likely 0, due to being
        // opened from the background chrome process for the extension that
        // has no physical dimensions
        const { screenX, screenY, outerWidth } = window
        top = Math.max(screenY, 0)
        left = Math.max(screenX + (outerWidth - NOTIFICATION_WIDTH), 0)
      }

      const popupWindow = await this.platform.openWindow({
        url: '/',
        type: 'popup',
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT,
        left,
        top
      })

      // Firefox currently ignores left/top for create, but it works for update
      if (popupWindow.left !== left && popupWindow.state !== 'fullscreen') {
        await this.platform.updateWindowPosition(popupWindow.id, left, top)
      }
      // pass new created popup window id to appController setter
      // and store the id to private variable this._popupId for future access
      this._setCurrentPopupId(popupWindow.id)
      this._popupId = popupWindow.id
    }
  }

  _onWindowClosed(windowId: number) {
    if (windowId === this._popupId) {
      this._setCurrentPopupId(undefined)
      this._popupId = undefined
      this.emit(NOTIFICATION_MANAGER_EVENTS.POPUP_CLOSED, {
        automaticallyClosed: this._popupAutomaticallyClosed
      })
      this._popupAutomaticallyClosed = undefined
    }
  }

  /**
   * Checks all open MetaMask windows, and returns the first one it finds that is a notification window (i.e. has the
   * type 'popup')
   *
   * @private
   */
  async _getPopup(currentPopupId?: number) {
    const windows = await this.platform.getAllWindows()
    return this._getPopupIn(windows)
  }

  /**
   * Given an array of windows, returns the 'popup' that has been opened by MetaMask, or null if no such window exists.
   *
   * @private
   * @param {Array} windows - An array of objects containing data about the open MetaMask extension windows.
   */
  _getPopupIn(windows: any[]) {
    return windows
      ? windows.find((win) => {
          // Returns notification popup
          return win && win.type === 'popup' && win.id === this._popupId
        })
      : null
  }
}

// init
export const notificationManager = new NotificationManager()
global.DOID_NOTIFIER = notificationManager
notificationManager.on(NOTIFICATION_MANAGER_EVENTS.POPUP_CLOSED, ({ automaticallyClosed }) => {
  if (!automaticallyClosed) {
    rejectUnapprovedNotifications()
  } else if (getUnapprovedTransactionCount() > 0) {
    triggerUi()
  }
})

export const getUnapprovedTransactionCount = function () {
  return 0
  // const { controller } = swGlobal
  // if (!controller) debugger
  // const unapprovedTxCount = controller.txController.getUnapprovedTxCount()
  // const { unapprovedMsgCount } = controller.messageManager
  // const { unapprovedPersonalMsgCount } = controller.personalMessageManager
  // const { unapprovedDecryptMsgCount } = controller.decryptMessageManager
  // const { unapprovedEncryptionPublicKeyMsgCount } = controller.encryptionPublicKeyManager
  // const { unapprovedTypedMessagesCount } = controller.typedMessageManager
  // const pendingApprovalCount = controller.approvalController.getTotalApprovalCount()
  // const waitingForUnlockCount = controller.appStateController.waitingForUnlock.length
  // return (
  //   unapprovedTxCount +
  //   unapprovedMsgCount +
  //   unapprovedPersonalMsgCount +
  //   unapprovedDecryptMsgCount +
  //   unapprovedEncryptionPublicKeyMsgCount +
  //   unapprovedTypedMessagesCount +
  //   pendingApprovalCount +
  //   waitingForUnlockCount
  // )
}
export const updateBadge = function () {
  let label = ''
  const count = getUnapprovedTransactionCount()
  if (count) {
    label = String(count)
  }
  // browserAction has been replaced by action in MV3
  browser.action.setBadgeText({ text: label })
  browser.action.setBadgeBackgroundColor({ color: '#037DD6' })
}

export const rejectUnapprovedNotifications = function () {
  const { controller } = swGlobal
  if (!controller) debugger
  // Object.keys(controller.txController.txStateManager.getUnapprovedTxList()).forEach((txId) =>
  //   controller.txController.txStateManager.setTxStatusRejected(txId)
  // )
  // controller.messageManager.messages
  //   .filter((msg: any) => msg.status === 'unapproved')
  //   .forEach((tx: any) => controller.messageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE_SIG))
  // controller.personalMessageManager.messages
  //   .filter((msg: any) => msg.status === 'unapproved')
  //   .forEach((tx: any) => controller.personalMessageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE_SIG))
  // controller.typedMessageManager.messages
  //   .filter((msg: any) => msg.status === 'unapproved')
  //   .forEach((tx: any) => controller.typedMessageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE_SIG))
  // controller.decryptMessageManager.messages
  //   .filter((msg: any) => msg.status === 'unapproved')
  //   .forEach((tx: any) => controller.decryptMessageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE))
  // controller.encryptionPublicKeyManager.messages
  //   .filter((msg: any) => msg.status === 'unapproved')
  //   .forEach((tx: any) => controller.encryptionPublicKeyManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE))

  // Finally, resolve snap dialog approvals on Flask and reject all the others managed by the ApprovalController.
  Object.values(controller.approvalController.state.pendingApprovals).forEach(({ id, type }) => {
    switch (type) {
      default:
        controller.approvalController.reject(id, ethErrors.provider.userRejectedRequest())
        break
    }
  })

  updateBadge.bind(this)()
}

export const triggerUi = async function () {
  const tabs = await swGlobal.platform.getActiveTabs()
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
if (!('triggerUi' in swGlobal)) swGlobal.triggerUi = triggerUi

export const openPopup = async function () {
  await triggerUi()
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!swGlobal.notificationIsOpen) {
        clearInterval(interval)
        resolve(true)
      }
    }, SECOND)
  })
}
