import swGlobal from '~/ext.scripts/sw/swGlobal'

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
      await this.notificationManager.showPopup(
        (newPopupId) => controller.appStateController.setCurrentPopupId(newPopupId),
        currentPopupId
      )
    } finally {
      swGlobal.uiIsTriggering = false
    }
  }
}
