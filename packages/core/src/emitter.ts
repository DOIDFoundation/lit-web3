// Global Event Emitter

export type EventEmitter = {
  on: Function
  off: Function
  once: Function
  emit: Function
}

const emitter: EventEmitter = {
  on: (type: string, listener: EventListener, options = {}) => {
    globalThis.addEventListener(type, listener, options)
    return () => globalThis.removeEventListener(type, listener)
  },
  off: (type: string, listener: EventListener) => {
    globalThis.removeEventListener(type, listener)
  },
  once: (type: string, listener: EventListener, options = {}) => {
    globalThis.addEventListener(type, listener, { ...options, once: true })
    return () => globalThis.removeEventListener(type, listener)
  },
  emit: <T>(type: string, detail?: T, options = {}) => {
    globalThis.dispatchEvent(new CustomEvent(type, { detail, ...options }))
  }
}

export const emitErr = (err: any) => {
  if (err.code === 4001) return
  emitter.emit('error', err)
}

export default emitter
