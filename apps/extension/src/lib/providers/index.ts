import { BaseProvider } from './BaseProvider'
import { createExternalExtensionProvider } from './extension-provider/createExternalExtensionProvider'
import { initializeProvider, injectProvider, setGlobalProvider } from './initializeInpageProvider'
import { MetaMaskInpageProvider, MetaMaskInpageProviderStreamName } from './MetaMaskInpageProvider'
import { StreamProvider } from './StreamProvider'

export {
  BaseProvider,
  createExternalExtensionProvider,
  initializeProvider,
  injectProvider,
  MetaMaskInpageProviderStreamName,
  MetaMaskInpageProvider,
  setGlobalProvider,
  StreamProvider
}
