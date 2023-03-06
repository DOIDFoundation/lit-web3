// !!! `this` must point to DOIDController with `bind()` method
import { setupMultiplex } from '~/lib/stream-utils'
import { createEngineStream } from 'json-rpc-middleware-stream'
import { ORIGIN_METAMASK } from '~/constants/app'
import { nanoid } from 'nanoid'
import pump from 'pump'
import { SubjectType, SubjectMetadataController } from '@metamask/subject-metadata-controller'

interface setupUntrustedCommunicationOptions {
  connectionStream: ReadableStream
  sender: Sender
  subjectType: string
}
export const setupUntrustedCommunication = function (
  { connectionStream, sender, subjectType } = <setupUntrustedCommunicationOptions>{}
) {
  let _subjectType
  if (subjectType) {
    _subjectType = subjectType
  } else if (sender.id && sender.id !== chrome.runtime.id) {
    _subjectType = SubjectType.Extension
  } else {
    _subjectType = SubjectType.Website
  }
  const mux = setupMultiplex(connectionStream)
  // // messages between inpage and background
  setupProviderConnection.bind(this)(mux.createStream('DOID-provider'), sender, _subjectType)
}

export const setupProviderConnection = function (outStream: any, sender: Sender, subjectType: string) {
  let origin: any
  if (subjectType === SubjectType.Internal) {
    origin = ORIGIN_METAMASK
  }
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  else if (subjectType === SubjectType.Snap) {
    origin = sender.snapId
  }
  ///: END:ONLY_INCLUDE_IN
  else if (sender.url) {
    origin = new URL(sender.url).origin
  }

  if (sender.id && sender.id !== chrome.runtime.id) {
    // this.subjectMetadataController.addSubjectMetadata({
    //   origin,
    //   extensionId: sender.id,
    //   subjectType: SubjectType.Extension
    // })
  }

  let tabId
  if (sender.tab && sender.tab.id) {
    tabId = sender.tab.id
  }

  // const engine = this.setupProviderEngine({
  //   origin,
  //   sender,
  //   subjectType,
  //   tabId
  // })

  // // setup connection
  // const providerStream = createEngineStream({ engine })
  // const connectionId = addConnection.bind(this)(origin, { engine })

  // pump(outStream, providerStream, outStream, (err) => {
  //   // handle any middleware cleanup
  //   engine._middleware.forEach((mid: any) => {
  //     if (mid.destroy && typeof mid.destroy === 'function') {
  //       mid.destroy()
  //     }
  //   })
  //   connectionId && removeConnection.bind(this)(origin, connectionId)
  //   if (err) {
  //     log.error(err)
  //   }
  // })
}

interface engineOpts {
  engine: object
}
export const addConnection = function (origin: string, { engine } = <engineOpts>{}) {
  if (origin === ORIGIN_METAMASK) {
    return null
  }
  if (!this.connections[origin]) {
    this.connections[origin] = {}
  }
  const id = nanoid()
  this.connections[origin][id] = {
    engine
  }
  return id
}

export const removeConnection = function (origin: string, id: string) {
  const connections = this.connections[origin]
  if (!connections) {
    return
  }
  delete connections[id]
  if (Object.keys(connections).length === 0) {
    delete this.connections[origin]
  }
}
export const removeAllConnections = function (origin: string) {
  const connections = this.connections[origin]
  if (!connections) {
    return
  }
  Object.keys(connections).forEach((id) => {
    this.removeConnection(origin, id)
  })
}

export const notifyConnections = function (origin: string, payload: unknown) {
  const connections = this.connections[origin]
  if (connections) {
    Object.values(connections).forEach((conn: any) => {
      if (conn.engine) {
        conn.engine.emit('notification', payload)
      }
    })
  }
}
export const notifyAllConnections = function (payload: unknown) {
  const getPayload = typeof payload === 'function' ? (origin: string) => payload(origin) : () => payload
  Object.keys(this.connections).forEach((origin) => {
    Object.values(this.connections[origin]).forEach(async (conn: any) => {
      if (conn.engine) {
        conn.engine.emit('notification', await getPayload(origin))
      }
    })
  })
}

export const setupControllerConnection = function (outStream: any) {
  const api = this.getApi()

  // report new active controller connection
  this.activeControllerConnections += 1
  this.emit('controllerConnectionChanged', this.activeControllerConnections)

  // set up postStream transport
  outStream.on('data', createMetaRPCHandler(api, outStream, this.store, this.localStoreApiWrapper))
  const handleUpdate = (update) => {
    if (outStream._writableState.ended) {
      return
    }
    // send notification to client-side
    outStream.write({
      jsonrpc: '2.0',
      method: 'sendUpdate',
      params: [update]
    })
  }
  this.on('update', handleUpdate)
  const startUISync = () => {
    if (outStream._writableState.ended) {
      return
    }
    // send notification to client-side
    outStream.write({
      jsonrpc: '2.0',
      method: 'startUISync'
    })
  }

  if (this.startUISync) {
    startUISync()
  } else {
    this.once('startUISync', startUISync)
  }

  outStream.on('end', () => {
    this.activeControllerConnections -= 1
    this.emit('controllerConnectionChanged', this.activeControllerConnections)
    this.removeListener('update', handleUpdate)
  })
}
