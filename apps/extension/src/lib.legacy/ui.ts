import { setupMultiplex } from './stream-utils'
import metaRPCClientFactory from './metaRPCClientFactory'
import { getEnvironmentType } from './utils'
import { checkForLastErrorAndLog } from '~/lib/ext.runtime/utils'
import { ENVIRONMENT_TYPE_POPUP } from '~/constants/app'
import PortStream from '~/lib/ext.runtime/extension-port-stream'

export async function getConnectStream() {
  const windowType = getEnvironmentType()
  console.log(windowType, 'windowType')
  // setup stream to background
  const extensionPort = chrome.runtime.connect({ name: windowType })
  let connectionStream = new PortStream(extensionPort)
  const activeTab = await queryCurrentActiveTab(windowType)

  extensionPort.onMessage.addListener(messageListener)
  return connectionStream
}
export function connectToAccountManager(connectionStream: any, cb: any) {
  const mx = setupMultiplex(connectionStream)
  const controllerConnectionStream = mx.createStream('controller')
  setupControllerConnection(controllerConnectionStream, cb)
  // setupWeb3Connection(mx.createStream('provider'));
}

export function setupControllerConnection(controllerConnectionStream: any, cb: any) {
  const backgroundRPC = metaRPCClientFactory(controllerConnectionStream)
  cb(null, backgroundRPC)
}

const messageListener = async (message: any = {}) => {
  // if (message?.data?.method === 'startUISync') {
  //   if (isUIInitialised) {
  //     // Currently when service worker is revived we create new streams
  //     // in later version we might try to improve it by reviving same streams.
  //     updateUiStreams()
  //   } else {
  //     initializeUiWithTab(activeTab)
  //   }
  // }
}

async function queryCurrentActiveTab(windowType: string) {
  // At the time of writing we only have the `activeTab` permission which means
  // that this query will only succeed in the popup context (i.e. after a "browserAction")
  if (windowType !== ENVIRONMENT_TYPE_POPUP) {
    return {}
  }

  const tabs = await browser.tabs.query({ active: true, currentWindow: true }).catch((e) => {
    checkForLastErrorAndLog() || console.error(e)
  })

  const [activeTab] = tabs
  const { id, title, url } = activeTab
  const { origin, protocol } = url ? new URL(url) : {}

  if (!origin || origin === 'null') {
    return {}
  }

  return { id, title, origin, protocol, url }
}
