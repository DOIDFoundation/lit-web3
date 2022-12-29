import { beforeEach, describe, expect, it, vi } from 'vitest'

import emitter from '@lit-web3/core/src/emitter'

describe('Emitter', async () => {
  beforeEach(async () => {})

  it('emit/on', async () => {
    const [listener, listenerOnce, listenerOff, listener2] = [vi.fn(), vi.fn(), vi.fn(), vi.fn()]
    emitter.on('my-event', listener)
    emitter.on('my-event', listenerOff)
    emitter.once('my-event', listenerOnce)
    emitter.on('my-event2', listener2)
    emitter.off('my-event', listenerOff)
    emitter.emit('my-event')
    emitter.emit('my-event')
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listenerOnce).toHaveBeenCalledOnce()
    expect(listenerOff).not.toHaveBeenCalled()
    expect(listener2).not.toHaveBeenCalled()
  })
})
