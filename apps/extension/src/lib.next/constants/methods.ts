// Methods actually equal to events with param `{method: 'foo'}`

// background <-> inpage
export const publicMethods = Object.freeze(['DOID_setup', 'DOID_account', 'DOID_account_update'])
// background <-> popup
export const privateMethods = Object.freeze(['state_keyring', 'state_lock', 'state_isunlock', 'state_account'])
