import { BaseProvider } from './BaseProvider'
import { createExternalExtensionProvider } from './extension-provider/createExternalExtensionProvider'
import { initializeProvider, injectProvider, setGlobalProvider } from './initializeInpageProvider'
import { InpageProvider, InpageProviderStreamName } from './inpageProvider'
import { StreamProvider } from './StreamProvider'

export {
  BaseProvider,
  createExternalExtensionProvider,
  initializeProvider,
  injectProvider,
  InpageProviderStreamName,
  InpageProvider,
  setGlobalProvider,
  StreamProvider
}
