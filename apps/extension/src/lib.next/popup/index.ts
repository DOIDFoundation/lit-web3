import popupMessenger from '~/lib.next/messenger/popup'

export const isUnlock = async () => await popupMessenger.send('state_isunlock')
export const isInit = async () => await popupMessenger.send('state_isinitialized')
export const keyringState = async () => await popupMessenger.send('internal_keyring_state')
