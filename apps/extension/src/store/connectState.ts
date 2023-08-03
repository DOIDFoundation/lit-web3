export { StateController } from '@lit-app/state'
import popupMessenger from '~/lib.next/messenger/popup'
import { State, property } from '@lit-app/state'
import { getActiveTabs } from '~/lib.next/utils.ext'
import type { Tabs } from 'webextension-polyfill'

// Sync ui's connects state from backend
class UIConnects extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: 0 }) ts!: number
  @property({ value: false }) locked!: boolean
  // DOIDs
  @property({ value: {} }) connects!: Connects
  @property({ value: undefined }) tab!: Tabs.Tab
  empty() {
    Object.assign(this, { DOIDs: undefined, selectedDOID: {} })
  }
  get host() {
    const url = this.tab?.url
    return url ? new URL(url).host : ''
  }
  get names(): string[] {
    return this.connects[this.host]?.names ?? []
  }
  get name() {
    return this.names[0]
  }
  get isConnected() {
    return this.names.length
  }
  sync = async () => {
    this.pending = true
    await this.getTab()
    try {
      const { connects } = await popupMessenger.send('internal_getConnects')
      this.connects = connects
    } catch {}
    this.ts++
    this.pending = false
  }
  getTab = async () => {
    this.tab = (await getActiveTabs())[0]
  }

  constructor() {
    super()
    this.sync()
  }
}

export const uiConnects = new UIConnects()
popupMessenger.on('connect_change', uiConnects.sync)
