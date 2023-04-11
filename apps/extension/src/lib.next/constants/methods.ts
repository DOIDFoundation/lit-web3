// Methods actually equal to events with param `{method: 'foo'}`

// background <-> inpage
export const publicMethods = Object.freeze(
  ['DOID_setup', 'DOID_account', 'DOID_account_update'].reduce((a, key) => Object.assign(a, { [key]: true }), {})
)
// background <-> popup
export const privateMethods = Object.freeze(
  ['state_keyring', 'state_lock', 'state_isunlock', 'state_account'].reduce(
    (a, key) => Object.assign(a, { [key]: true }),
    {}
  )
)
