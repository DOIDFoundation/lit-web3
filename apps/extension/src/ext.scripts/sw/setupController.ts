import { connectRemote } from '~/ext.scripts/sw/connectRemote'
import swGlobal from '~/ext.scripts/sw/swGlobal'

export const setupController = function (initState, initLangCode) {
  //
  // MetaMask Controller
  //

  swGlobal.controller = new MetamaskController({
    infuraProjectId: process.env.INFURA_PROJECT_ID,
    // User confirmation callbacks:
    showUserConfirmation: triggerUi,
    openPopup,
    // initial state
    initState,
    // initial locale code
    initLangCode,
    // platform specific api
    platform,
    notificationManager,
    browser,
    getRequestAccountTabIds: () => {
      return requestAccountTabIds
    },
    getOpenMetamaskTabsIds: () => {
      return openMetamaskTabsIDs
    },
    localStore
  })

  setupEnsIpfsResolver({
    getCurrentChainId: controller.networkController.getCurrentChainId.bind(controller.networkController),
    getIpfsGateway: controller.preferencesController.getIpfsGateway.bind(controller.preferencesController),
    provider: controller.provider
  })

  // setup state persistence
  pump(
    storeAsStream(controller.store),
    debounce(1000),
    createStreamSink((state) => localStore.set(state)),
    (error) => {
      log.error('MetaMask - Persistence pipeline failed', error)
    }
  )

  setupSentryGetStateGlobal(controller)

  const isClientOpenStatus = () => {
    return popupIsOpen || Boolean(Object.keys(openMetamaskTabsIDs).length) || notificationIsOpen
  }

  const onCloseEnvironmentInstances = (isClientOpen, environmentType) => {
    // if all instances of metamask are closed we call a method on the controller to stop gasFeeController polling
    if (isClientOpen === false) {
      controller.onClientClosed()
      // otherwise we want to only remove the polling tokens for the environment type that has closed
    } else {
      // in the case of fullscreen environment a user might have multiple tabs open so we don't want to disconnect all of
      // its corresponding polling tokens unless all tabs are closed.
      if (environmentType === ENVIRONMENT_TYPE_FULLSCREEN && Boolean(Object.keys(openMetamaskTabsIDs).length)) {
        return
      }
      controller.onEnvironmentTypeClosed(environmentType)
    }
  }

  connectRemote = connectRemote

  // communication with page or other extension
  connectExternal = (remotePort) => {
    const portStream = new PortStream(remotePort)
    controller.setupUntrustedCommunication({
      connectionStream: portStream,
      sender: remotePort.sender
    })
  }

  //
  // User Interface setup
  //

  updateBadge()
  controller.txController.on(METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge)
  controller.messageManager.on(METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge)
  controller.personalMessageManager.on(METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge)
  controller.decryptMessageManager.on(METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge)
  controller.encryptionPublicKeyManager.on(METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge)
  controller.typedMessageManager.on(METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge)
  controller.appStateController.on(METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge)

  controller.controllerMessenger.subscribe(METAMASK_CONTROLLER_EVENTS.APPROVAL_STATE_CHANGE, updateBadge)

  /**
   * Updates the Web Extension's "badge" number, on the little fox in the toolbar.
   * The number reflects the current number of pending transactions or message signatures needing user approval.
   */
  function updateBadge() {
    let label = ''
    const count = getUnapprovedTransactionCount()
    if (count) {
      label = String(count)
    }
    // browserAction has been replaced by action in MV3
    if (isManifestV3) {
      browser.action.setBadgeText({ text: label })
      browser.action.setBadgeBackgroundColor({ color: '#037DD6' })
    } else {
      browser.browserAction.setBadgeText({ text: label })
      browser.browserAction.setBadgeBackgroundColor({ color: '#037DD6' })
    }
  }

  function getUnapprovedTransactionCount() {
    const unapprovedTxCount = controller.txController.getUnapprovedTxCount()
    const { unapprovedMsgCount } = controller.messageManager
    const { unapprovedPersonalMsgCount } = controller.personalMessageManager
    const { unapprovedDecryptMsgCount } = controller.decryptMessageManager
    const { unapprovedEncryptionPublicKeyMsgCount } = controller.encryptionPublicKeyManager
    const { unapprovedTypedMessagesCount } = controller.typedMessageManager
    const pendingApprovalCount = controller.approvalController.getTotalApprovalCount()
    const waitingForUnlockCount = controller.appStateController.waitingForUnlock.length
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

  notificationManager.on(NOTIFICATION_MANAGER_EVENTS.POPUP_CLOSED, ({ automaticallyClosed }) => {
    if (!automaticallyClosed) {
      rejectUnapprovedNotifications()
    } else if (getUnapprovedTransactionCount() > 0) {
      triggerUi()
    }
  })

  function rejectUnapprovedNotifications() {
    Object.keys(controller.txController.txStateManager.getUnapprovedTxList()).forEach((txId) =>
      controller.txController.txStateManager.setTxStatusRejected(txId)
    )
    controller.messageManager.messages
      .filter((msg) => msg.status === 'unapproved')
      .forEach((tx) => controller.messageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE_SIG))
    controller.personalMessageManager.messages
      .filter((msg) => msg.status === 'unapproved')
      .forEach((tx) => controller.personalMessageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE_SIG))
    controller.typedMessageManager.messages
      .filter((msg) => msg.status === 'unapproved')
      .forEach((tx) => controller.typedMessageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE_SIG))
    controller.decryptMessageManager.messages
      .filter((msg) => msg.status === 'unapproved')
      .forEach((tx) => controller.decryptMessageManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE))
    controller.encryptionPublicKeyManager.messages
      .filter((msg) => msg.status === 'unapproved')
      .forEach((tx) => controller.encryptionPublicKeyManager.rejectMsg(tx.id, REJECT_NOTFICIATION_CLOSE))

    // Finally, resolve snap dialog approvals on Flask and reject all the others managed by the ApprovalController.
    Object.values(controller.approvalController.state.pendingApprovals).forEach(({ id, type }) => {
      switch (type) {
        ///: BEGIN:ONLY_INCLUDE_IN(flask)
        case MESSAGE_TYPE.SNAP_DIALOG_ALERT:
        case MESSAGE_TYPE.SNAP_DIALOG_PROMPT:
          controller.approvalController.accept(id, null)
          break
        case MESSAGE_TYPE.SNAP_DIALOG_CONFIRMATION:
          controller.approvalController.accept(id, false)
          break
        ///: END:ONLY_INCLUDE_IN
        default:
          controller.approvalController.reject(id, ethErrors.provider.userRejectedRequest())
          break
      }
    })

    updateBadge()
  }
}
