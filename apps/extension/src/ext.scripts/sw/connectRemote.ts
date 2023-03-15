import {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_FULLSCREEN,
  ENVIRONMENT_TYPE_BACKGROUND
} from '~/constants/app'

import endOfStream from 'end-of-stream'
import swGlobal, { isClientOpenStatus } from '~/ext.scripts/sw/swGlobal'
import PortStream from '~/lib/ext.runtime/extension-port-stream'

const blockedPorts = ['trezor-connect']
export const connectRemote = async (remotePort: chrome.runtime.Port) => {
  const processName = remotePort.name
  if (blockedPorts.includes(remotePort.name)) return

  let isInternalProcess = false
  const senderUrl = remotePort.sender?.url ? new URL(remotePort.sender.url) : null

  isInternalProcess = [`chrome`, 'edge']
    .map((r) => `${r}-extension://${browser.runtime.id}`)
    .includes(senderUrl?.origin ?? '')
  if (isInternalProcess) {
    const portStream = new PortStream(remotePort)
    // communication with popup
    swGlobal.controller.isClientOpen = true
    swGlobal.controller.setupTrustedCommunication(portStream, remotePort.sender)

    remotePort.onMessage.addListener((message) => {
      if (message.name === swGlobal.WORKER_KEEP_ALIVE_MESSAGE) {
        // To test un-comment this line and wait for 1 minute. An error should be shown on MetaMask UI.
        remotePort.postMessage({ name: swGlobal.ACK_KEEP_ALIVE_MESSAGE })
      }
    })

    if (processName === ENVIRONMENT_TYPE_POPUP) {
      swGlobal.popupIsOpen = true
      endOfStream(portStream, () => {
        swGlobal.popupIsOpen = false
        const isClientOpen = isClientOpenStatus()
        swGlobal.controller.isClientOpen = isClientOpen
        swGlobal.onCloseEnvironmentInstances(processName)
      })
    }

    if (processName === ENVIRONMENT_TYPE_NOTIFICATION) {
      swGlobal.notificationIsOpen = true

      endOfStream(portStream, () => {
        swGlobal.notificationIsOpen = false
        const isClientOpen = isClientOpenStatus()
        swGlobal.controller.isClientOpen = isClientOpen
        swGlobal.onCloseEnvironmentInstances(processName)
      })
    }

    if (processName === ENVIRONMENT_TYPE_FULLSCREEN) {
      const tabId = remotePort.sender!.tab!.id
      swGlobal.openMetamaskTabsIDs[tabId] = true

      endOfStream(portStream, () => {
        delete swGlobal.openMetamaskTabsIDs[tabId]
        const isClientOpen = isClientOpenStatus()
        swGlobal.controller.isClientOpen = isClientOpen
        swGlobal.onCloseEnvironmentInstances(processName)
      })
    }
  } else {
    if (remotePort.sender && remotePort.sender.tab && remotePort.sender.url) {
      const tabId = remotePort.sender.tab.id
      const url = new URL(remotePort.sender.url)
      const { origin } = url

      remotePort.onMessage.addListener((msg) => {
        if (msg.data && ['DOID_requestAccount', 'eth_requestAccounts'].includes(msg.data.method)) {
          swGlobal.requestAccountTabIds[origin] = tabId
        }
      })
    }
    connectExternal(remotePort)
  }
}

export const connectExternal = (remotePort: chrome.runtime.Port) => {
  const portStream = new PortStream(remotePort)
  swGlobal.controller.setupUntrustedCommunication({
    connectionStream: portStream,
    sender: remotePort.sender
  })
  return portStream
}
