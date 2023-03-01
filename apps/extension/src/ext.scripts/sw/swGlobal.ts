import { ENVIRONMENT_TYPE_FULLSCREEN } from '~/constants/app'
import PortStream from '~/lib/ext.runtime/extension-port-stream'

export const swGlobal: SWGlobal = {
  popupIsOpen: false,
  notificationIsOpen: false,
  uiIsTriggering: false,
  openMetamaskTabsIDs: {},
  requestAccountTabIds: {},
  controller: null,
  WORKER_KEEP_ALIVE_MESSAGE: 'WORKER_KEEP_ALIVE_MESSAGE'
}
export default swGlobal

export const isClientOpenStatus = () => {
  return (
    swGlobal.popupIsOpen || Boolean(Object.keys(swGlobal.openMetamaskTabsIDs).length) || swGlobal.notificationIsOpen
  )
}

export const onCloseEnvironmentInstances = (environmentType: string) => {
  // if all instances of metamask are closed we call a method on the controller to stop gasFeeController polling
  if (isClientOpenStatus() === false) {
    swGlobal.controller.onClientClosed()
    // otherwise we want to only remove the polling tokens for the environment type that has closed
  } else {
    // in the case of fullscreen environment a user might have multiple tabs open so we don't want to disconnect all of
    // its corresponding polling tokens unless all tabs are closed.
    if (environmentType === ENVIRONMENT_TYPE_FULLSCREEN && Boolean(Object.keys(swGlobal.openMetamaskTabsIDs).length)) {
      return
    }
    swGlobal.controller.onEnvironmentTypeClosed(environmentType)
  }
}

export const connectExternal = (remotePort: chrome.runtime.Port) => {
  const portStream = new PortStream(remotePort)
  swGlobal.controller.setupUntrustedCommunication({
    connectionStream: portStream,
    sender: remotePort.sender
  })
}
