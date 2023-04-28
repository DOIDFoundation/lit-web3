import popupMessenger from '~/lib.next/messenger/popup'

export const isInit = async () => await popupMessenger.send('internal_isinitialized')
export const isUnlock = async () => await popupMessenger.send('internal_isunlock')
export const isConnected = async () => await popupMessenger.send('internal_isconnected')
export const keyringState = async () => await popupMessenger.send('internal_keyring_state')
