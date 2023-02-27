// AKA inject.ts (just used to inject inpage.js)
import '@lit-web3/core/src/shims/node'
// @ts-expect-error
import inpage from '/public/inpage.js?script&module'
import { EXTENSION_MESSAGES, MESSAGE_TYPE } from '~/constants/app'
import ObjectMultiplex from 'obj-multiplex'
import pump from 'pump'
import PortStream from '~/lib/ext.runtime/extension-port-stream'
import shouldInjectProvider from '~/lib/providers/injection'
import { WindowPostMessageStream } from '@metamask/post-message-stream'
import { checkForLastError } from '~/lib/ext.runtime/utils'

const logger = (...args: any) => console.info(`[contentscript]`, ...args)

if (typeof chrome !== 'undefined') {
  const s = document.createElement('script')
  s.src = chrome.runtime.getURL(inpage)
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

/**
 * Initializes two-way communication streams between the browser extension and
 * the local per-page browser context. This function also creates an event listener to
 * reset the streams if the service worker resets.
 */
const initStreams = () => {
  setupPageStreams()

  setupExtensionStreams()

  chrome.runtime.onMessage.addListener(onMessageSetUpExtensionStreams)
}

const onMessageSetUpExtensionStreams = (msg) => {
  if (msg.name === EXTENSION_MESSAGES.READY) {
    if (!extensionStream) {
      setupExtensionStreams()
    }
    return Promise.resolve(`DOID: handled ${EXTENSION_MESSAGES.READY}`)
  }
  return undefined
}

const sendMessageWorkerKeepAlive = () => {
  chrome.runtime.sendMessage({ name: 'WORKER_KEEP_ALIVE_MESSAGE' }).catch((e) => {
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
    if (chrome.runtime.id) {
      sendMessageWorkerKeepAlive()
    }
  }, 1000)
}

function logStreamDisconnectWarning(remoteLabel, error) {
  console.debug(`DOID: Content script lost connection to "${remoteLabel}".`, error)
}

const setupPageStreams = () => {
  // the transport-specific streams for communication between inpage and background
  const pageStream = new WindowPostMessageStream({
    name: CONTENT_SCRIPT,
    target: INPAGE
  })

  pageStream.on('data', ({ data: { method } }) => {
    logger({ method })
    if (!IGNORE_INIT_METHODS_FOR_KEEP_ALIVE.includes(method)) {
      runWorkerKeepAliveInterval()
    }
  })

  // create and connect channel muxers
  // so we can handle the channels individually
  pageMux = new ObjectMultiplex()
  pageMux.setMaxListeners(25)

  pump(pageMux, pageStream, pageMux, (err) => logStreamDisconnectWarning('DOID Inpage Multiplex', err))

  pageChannel = pageMux.createStream(PROVIDER)
}

function notifyInpageOfStreamFailure() {
  window.postMessage(
    {
      target: INPAGE, // the post-message-stream "target"
      data: {
        // this object gets passed to obj-multiplex
        name: PROVIDER, // the obj-multiplex channel name
        data: {
          jsonrpc: '2.0',
          method: 'DOID_STREAM_FAILURE'
        }
      }
    },
    window.location.origin
  )
}

const setupExtensionStreams = () => {
  EXTENSION_CONNECT_SENT = true
  extensionPort = chrome.runtime.connect({ name: CONTENT_SCRIPT })
  console.log('kk', extensionPort)
  extensionStream = new PortStream(extensionPort)
  extensionStream.on('data', extensionStreamMessageListener)

  // create and connect channel muxers
  // so we can handle the channels individually
  extensionMux = new ObjectMultiplex()
  extensionMux.setMaxListeners(25)

  pump(extensionMux, extensionStream, extensionMux, (err) => {
    logStreamDisconnectWarning('DOID Background Multiplex', err)
    notifyInpageOfStreamFailure()
  })

  // forward communication across inpage-background for these channels only
  extensionChannel = extensionMux.createStream(PROVIDER)
  pump(pageChannel, extensionChannel, pageChannel, (error) =>
    console.debug(`DOID: Muxed traffic for channel "${PROVIDER}" failed.`, error)
  )

  // eslint-disable-next-line no-use-before-define
  extensionPort.onDisconnect.addListener(onDisconnectDestroyStreams)
}

function extensionStreamMessageListener(msg: any) {
  console.log('hh')
  if (EXTENSION_CONNECT_SENT && msg.data.method === 'DOID_chainChanged') {
    EXTENSION_CONNECT_SENT = false
    window.postMessage(
      {
        target: INPAGE, // the post-message-stream "target"
        data: {
          // this object gets passed to obj-multiplex
          name: PROVIDER, // the obj-multiplex channel name
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
