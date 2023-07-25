// Methods of Service (allowlist)
// Methods actually equal to events with param `{method: 'foo'}`

/* Background Methods */
// background <-> inpage
export const publicMethods = Object.freeze([
  // DOID
  'DOID_setup',
  'DOID_name',
  'DOID_requestName',
  'DOID_account',
  'DOID_account_update',
  'DOID_account_change',
  'DOID_account_recover',
  'DOID_chain_address',
  'reply_DOID_setup',
  // EVM
  'evm_request',
  'evm_response'
])
// background <-> popup (Always pass private methods, so far)
// export const privateMethods = Object.freeze(['state_keyring', 'state_lock', 'internal_isunlock', 'state_account'])

/* Popup Methods */
// popup -> background (Always pass private methods, so far)
export const popupMethods = Object.freeze([])

/* Inpage Methods */
// inpage -> background
export const inpageMethods = Object.freeze(['DOID_setup', 'DOID_account'])
