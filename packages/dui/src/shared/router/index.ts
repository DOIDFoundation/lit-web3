import emitter from '@lit-web3/core/src/emitter'

export const goto = (path: string) => {
  emitter.emit('router-goto', path)
}

export const replace = (path: string) => {
  emitter.emit('router-replace', path)
}
