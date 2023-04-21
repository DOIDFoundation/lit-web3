import browser from 'webextension-polyfill'
import emitter from '@lit-web3/core/src/emitter'
import { BACKGROUND_EVENTS } from '~/lib.next/constants/events'
import { openPopup } from '~/lib.next/background/notifier'
import { popupStorage } from '~/lib.next/background/storage/popupStorage'

emitter.on(BACKGROUND_EVENTS.UPDATE_BADGE, updateBadge)

function updateBadge() {
  const count = getUnapprovedTransactionCount() || ''
  browser.action.setBadgeText({ text: count?.toString() || '' })
  browser.action.setBadgeBackgroundColor({ color: '#037DD6' })
}

function getUnapprovedTransactionCount() {
  const unapprovedTxCount = 0
  const unapprovedMsgCount = 0
  const unapprovedPersonalMsgCount = 0
  const unapprovedDecryptMsgCount = 0
  const unapprovedEncryptionPublicKeyMsgCount = 0
  const unapprovedTypedMessagesCount = 0
  const pendingApprovalCount = 0
  const waitingForUnlockCount = 0
  return (
    unapprovedTxCount +
    unapprovedMsgCount +
    unapprovedPersonalMsgCount +
    unapprovedDecryptMsgCount +
    unapprovedEncryptionPublicKeyMsgCount +
    unapprovedTypedMessagesCount +
    pendingApprovalCount +
    waitingForUnlockCount
  )
}

emitter.on('popup_closed', () => {
  if (!popupStorage._popupAutomaticallyClosed) {
    // rejectUnapprovedNotifications()
  } else if (getUnapprovedTransactionCount() > 0) {
    openPopup()
  }
})
