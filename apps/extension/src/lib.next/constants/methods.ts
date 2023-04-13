// Methods of Service (allowlist)
// Methods actually equal to events with param `{method: 'foo'}`

/* Background Methods */
// background <-> inpage
export const publicMethods = Object.freeze([
  'DOID_setup',
  'DOID_name',
  'DOID_account',
  'DOID_account_update',
  'DOID_account_change'
])
// background <-> popup (Always pass private methods, so far)
// export const privateMethods = Object.freeze(['state_keyring', 'state_lock', 'state_isunlock', 'state_account'])

/* Popup Methods */
// popup -> background (Always pass private methods, so far)
export const popupMethods = Object.freeze([])

/* Inpage Methods */
// inpage -> background
export const inpageMethods = Object.freeze(['DOID_setup', 'DOID_account'])
