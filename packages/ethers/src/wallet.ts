import emitter from '@lit-web3/core/src/emitter'

export enum WalletState {
  DISCONNECTED = 'Disconnected',
  CONNECTED = 'Connected',
  CONNECTING = 'Connecting...',
  NOT_INSTALLED = 'Not Installed',
  INSTALLED = 'Installed',
  INSTALLING = 'Installing'
}

// Trick for @lit-app/state
export const forceRequestUpdate = async () => {
  await 0
  emitter.emit('force-request-update')
}
