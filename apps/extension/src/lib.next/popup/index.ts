import popupMessenger from '~/lib.next/messenger/popup'

export const isUnlock = async () => await popupMessenger.send('state_isunlock')
