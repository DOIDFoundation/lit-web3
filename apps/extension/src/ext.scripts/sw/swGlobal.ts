import { ENVIRONMENT_TYPE_FULLSCREEN, EXTENSION_MESSAGES } from '~/constants/app'
import PortStream from '~/lib/ext.runtime/extension-port-stream'
import { checkForLastErrorAndLog } from '~/lib/ext.runtime/utils'

export const swGlobal: SWGlobal = {
  popupIsOpen: false,
  notificationIsOpen: false,
  uiIsTriggering: false,
  openMetamaskTabsIDs: {},
  requestAccountTabIds: {},
  controller: null,
  WORKER_KEEP_ALIVE_MESSAGE: 'WORKER_KEEP_ALIVE_MESSAGE',
  initialState: {
    config: {},
    PreferencesController: {
      frequentRpcListDetail: [
        {
          rpcUrl: 'http://localhost:8545',
          chainId: '0x539',
          ticker: 'ETH',
          nickname: 'Localhost 8545',
          rpcPrefs: {}
        }
      ]
    }
  }
}
export default swGlobal

export const isClientOpenStatus = () => {
  return (
    swGlobal.popupIsOpen || Boolean(Object.keys(swGlobal.openMetamaskTabsIDs).length) || swGlobal.notificationIsOpen
  )
}

export const onCloseEnvironmentInstances = (environmentType: string) => {
  if (isClientOpenStatus() === false) {
    swGlobal.controller.onClientClosed()
  } else {
    if (environmentType === ENVIRONMENT_TYPE_FULLSCREEN && Boolean(Object.keys(swGlobal.openMetamaskTabsIDs).length)) {
      return
    }
    swGlobal.controller.onEnvironmentTypeClosed(environmentType)
  }
}

export const sendReadyMessageToTabs = async () => {
  const tabs = await chrome.tabs
    .query({ url: '<all_urls>', windowType: 'normal' })
    .then((result) => {
      checkForLastErrorAndLog()
      return result
    })
    .catch(() => checkForLastErrorAndLog())

  /** @todo we should only sendMessage to dapp tabs, not all tabs. */
  if (!Array.isArray(tabs)) return
  for (const tab of tabs) {
    chrome.tabs
      .sendMessage(tab.id, { name: EXTENSION_MESSAGES.READY })
      .then(() => checkForLastErrorAndLog())
      .catch(() => checkForLastErrorAndLog())
  }
}
