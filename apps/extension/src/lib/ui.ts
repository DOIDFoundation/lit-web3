import { setupMultiplex } from './stream-utils'
import metaRPCClientFactory from './metaRPCClientFactory'
import { getEnvironmentType } from './utils'
import PortStream from '~/lib/ext.runtime/extension-port-stream'

export function getConnectStream() {
  const windowType = getEnvironmentType()
  console.log(windowType, 'windowType')

  const extensionPort = chrome.runtime.connect({ name: windowType })
  let connectionStream = new PortStream(extensionPort)
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
