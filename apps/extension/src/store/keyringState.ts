export { StateController } from '@lit-app/state'
import popupMessenger from '~/lib.next/messenger/popup'
import { State, property } from '@lit-app/state'

// Sync ui's keyring state with backend
class UIKeyring extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: 0 }) ts!: number
  @property({ value: false }) locked!: boolean
  // DOIDs
  @property({ value: {} }) DOIDs!: VaultDOIDs
  @property({ value: {} }) selectedDOID!: VaultDOID | undefined
  @property({ value: '' }) mnemonic!: string

  empty() {
    Object.assign(this, { DOIDs: undefined, selectedDOID: {} })
  }
  sync = async () => {
    this.pending = true
    try {
      const { DOIDs, selectedDOID } = await popupMessenger.send('internal_getDOIDs')
      if (this.locked) return
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
    this.sync()
  }
}

export const uiKeyring = new UIKeyring()
popupMessenger.on('keyring_update', uiKeyring.sync)
popupMessenger.on('lock', uiKeyring.onLock)
popupMessenger.on('unlock', uiKeyring.onUnlock)
