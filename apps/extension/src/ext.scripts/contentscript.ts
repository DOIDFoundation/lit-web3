// AKA inject.ts (just used to inject inpage.js)
import '@lit-web3/core/src/shims/node'
import browser from 'webextension-polyfill'
// @ts-expect-error
import inpage from '/public/inpage.js?script&module'
import { EXTENSION_MESSAGES, MESSAGE_TYPE } from '~/constants/app'
import ObjectMultiplex from '@metamask/object-multiplex'
import pump from 'pump'
import PortStream from '~/lib/ext.runtime/extension-port-stream'
import shouldInjectProvider from '~/lib/providers/injection'
import { WindowPostMessageStream } from '@metamask/post-message-stream'
import { checkForLastError } from '~/lib/ext.runtime/utils'

const logger = (...args: any) => console.info(`[contentscript]`, ...args)

if (typeof browser !== 'undefined') {
  const s = document.createElement('script')
  s.setAttribute('async', 'false')
  s.src = browser.runtime.getURL(inpage)
  s.onload = () => s.remove()
  const target = document.head || document.documentElement
  target.appendChild(s)
}

// contexts
const CONTENT_SCRIPT = 'DOID-contentscript'
const INPAGE = 'DOID-inpage'
const PROVIDER = 'DOID-provider'
const IGNORE_INIT_METHODS_FOR_KEEP_ALIVE = [MESSAGE_TYPE.GET_PROVIDER_STATE, MESSAGE_TYPE.SEND_METADATA]

let extensionMux: any, extensionChannel: any, extensionPort: any, extensionStream: any, pageMux, pageChannel: any
let EXTENSION_CONNECT_SENT = false
let keepAliveInterval: any
let keepAliveTimer: any

const initStreams = () => {
  setupPageStreams()
  setupExtensionStreams()
  browser.runtime.onMessage.addListener(onMessageSetUpExtensionStreams)
}

const onMessageSetUpExtensionStreams = (msg: any) => {
  if (msg.name === EXTENSION_MESSAGES.READY) {
    if (!extensionStream) {
      setupExtensionStreams()
    }
    return Promise.resolve(`DOID: handled ${EXTENSION_MESSAGES.READY}`)
  }
}

const sendMessageWorkerKeepAlive = () => {
  browser.runtime.sendMessage({ name: 'WORKER_KEEP_ALIVE_MESSAGE' }).catch((e) => {
    e.message === 'Extension context invalidated.'
      ? logger(`Please refresh the page. DOID: ${e}`)
      : logger(`DOID: ${e}`)
  })
}

const runWorkerKeepAliveInterval = () => {
  clearTimeout(keepAliveTimer)

  keepAliveTimer = setTimeout(() => {
    clearInterval(keepAliveInterval)
  }, 45 * 60 * 1000)

  clearInterval(keepAliveInterval)

  sendMessageWorkerKeepAlive()

  keepAliveInterval = setInterval(() => {
    if (browser.runtime.id) {
      sendMessageWorkerKeepAlive()
    }
  }, 1000)
}

function logStreamDisconnectWarning(remoteLabel: string, error: any) {
  console.debug(`DOID: Content script lost connection to "${remoteLabel}".`, error)
}

const setupPageStreams = () => {
  // the transport-specific streams for communication between inpage and background
  const pageStream = new WindowPostMessageStream({
    name: CONTENT_SCRIPT,
    target: INPAGE
  })

  pageStream.on('data', ({ data: { method } }) => {
    logger('pagestream on data:', { method })
    if (!IGNORE_INIT_METHODS_FOR_KEEP_ALIVE.includes(method)) {
      runWorkerKeepAliveInterval()
    }
  })

  pageMux = new ObjectMultiplex()
  pageMux.setMaxListeners(25)

  pump(pageMux, pageStream, pageMux, (err) => logStreamDisconnectWarning('DOID Inpage Multiplex', err))

  pageChannel = pageMux.createStream(PROVIDER)
}

function notifyInpageOfStreamFailure() {
  window.postMessage(
    {
      target: INPAGE,
      data: {
        name: PROVIDER,
        data: { jsonrpc: '2.0', method: 'DOID_STREAM_FAILURE' }
      }
    },
    window.location.origin
  )
}

const setupExtensionStreams = () => {
  EXTENSION_CONNECT_SENT = true
  extensionPort = browser.runtime.connect({ name: CONTENT_SCRIPT })
  extensionStream = new PortStream(extensionPort)
  extensionStream.on('data', extensionStreamMessageListener)
  extensionMux = new ObjectMultiplex()
  extensionMux.setMaxListeners(25)
  pump(extensionMux, extensionStream, extensionMux, (err) => {
    logStreamDisconnectWarning('DOID Background Multiplex', err)
    notifyInpageOfStreamFailure()
  })
  extensionChannel = extensionMux.createStream(PROVIDER)
  pump(pageChannel, extensionChannel, pageChannel, (error) =>
    console.debug(`DOID: Muxed traffic for channel "${PROVIDER}" failed.`, error)
  )
  extensionPort.onDisconnect.addListener(onDisconnectDestroyStreams)
}

function extensionStreamMessageListener(msg: any) {
  logger('ondata', msg)
  if (EXTENSION_CONNECT_SENT && msg.data.method === 'DOID_chainChanged') {
    EXTENSION_CONNECT_SENT = false
    window.postMessage(
      {
        target: INPAGE,
        data: {
          name: PROVIDER,
          data: {
            jsonrpc: '2.0',
            method: 'DOID_EXTENSION_CONNECT_CAN_RETRY'
          }
        }
      },
      window.location.origin
    )
  }
}

const onDisconnectDestroyStreams = () => {
  const err = checkForLastError()
  extensionPort.onDisconnect.removeListener(onDisconnectDestroyStreams)
  destroyExtensionStreams()
  if (err) {
    console.warn(`${err} Resetting the streams.`)
    setTimeout(setupExtensionStreams, 1000)
  }
}
const destroyExtensionStreams = () => {
  pageChannel.removeAllListeners()
  extensionMux.removeAllListeners()
  extensionMux.destroy()
  extensionChannel.removeAllListeners()
  extensionChannel.destroy()
  extensionStream = null
}

const start = () => {
  if (shouldInjectProvider('contentscript')) initStreams()
  logger('started')
}
start()
