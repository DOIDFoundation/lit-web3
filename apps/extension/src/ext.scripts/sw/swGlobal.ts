import { ENVIRONMENT_TYPE_FULLSCREEN, EXTENSION_MESSAGES } from '~/constants/app'
import { checkForLastErrorAndLog } from '~/lib/ext.runtime/utils'
import LocalStore from '~/ext.scripts/sw/localStore'
import ReadOnlyNetworkStore from '~/ext.scripts/sw/networkStore'

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
  },
  localStore: import.meta.env.MODE === 'test' ? new ReadOnlyNetworkStore() : new LocalStore()
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
  console.log('send')
  const tabs = await chrome.tabs
    .query({ url: '<all_urls>', windowType: 'normal' })
    .then((result) => {
      checkForLastErrorAndLog()
      return result
    })
    .catch(() => checkForLastErrorAndLog())
  console.log('send', 2)

  /** @todo we should only sendMessage to dapp tabs, not all tabs. */
  if (!Array.isArray(tabs)) return
  console.log('send', 3, tabs)
  for (const tab of tabs) {
    chrome.tabs
      .sendMessage(tab.id, { name: EXTENSION_MESSAGES.READY })
      .then(() => checkForLastErrorAndLog())
      .catch(() => checkForLastErrorAndLog())
  }
}
