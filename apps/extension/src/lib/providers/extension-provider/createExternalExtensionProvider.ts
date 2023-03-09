import PortStream from '~/lib/ext.runtime/extension-port-stream'
import { InpageProviderStreamName } from '../InpageProvider'
import { StreamProvider } from '../StreamProvider'
import { getDefaultExternalMiddleware } from '../utils'
import config from './external-extension-config.json'
import browser from 'webextension-polyfill'

export function createExternalExtensionProvider() {
  let provider

  try {
    const currentId = getId()
    const port = chrome.runtime.connect(currentId) as browser.Runtime.Port

    const pluginStream = new PortStream(port)
    provider = new StreamProvider(pluginStream, {
      jsonRpcStreamName: InpageProviderStreamName,
      logger: console,
      rpcMiddleware: getDefaultExternalMiddleware(console)
    })

    // This is asynchronous but merely logs an error and does not throw upon
    // failure. Previously this just happened as a side-effect in the
    // constructor.
    provider.initialize()
  } catch (error) {
    console.dir(`DOID connect error.`, error)
    throw error
  }
  return provider
}

function getId() {
  return config[/firefox/.test(navigator.userAgent) ? 'FIREFOX_ID' : 'CHROME_ID']
}
