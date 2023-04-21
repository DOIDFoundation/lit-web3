export { StateController } from '@lit-app/state'
import popupMessenger from '~/lib.next/messenger/popup'
import { State, property } from '@lit-app/state'

// Sync ui's keyring state with backend
class UIKeyring extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: 0 }) ts!: number
  @property({ value: true }) locked!: boolean
  // DOIDs
  @property({ value: {} }) DOIDs!: VaultDOIDs
  @property({ value: {} }) selectedDOID!: VaultDOID | undefined
  @property({ value: '' }) mnemonic!: string

  empty() {
    Object.assign(this, { DOIDs: undefined, selectedDOID: {} })
  }
  sync = async (force = false) => {
    if (this.locked && !force) return
    this.pending = true
    try {
      const { DOIDs, selectedDOID } = await popupMessenger.send('internal_getDOIDs')
      if (this.locked && !force) return
      Object.assign(this, { DOIDs, selectedDOID })
    } catch {}
    this.ts++
    this.pending = false
  }
  onLock = () => {
    this.locked = true
    this.empty()
  }
  onUnlock = () => {
    this.locked = false
  }

  constructor() {
    super()
    this.sync(true)
    popupMessenger.on('keyring_update', () => this.sync())
    popupMessenger.on('lock', this.onLock)
    popupMessenger.on('unlock', this.onUnlock)
  }
}

export const uiKeyring = new UIKeyring()
