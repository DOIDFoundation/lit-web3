import { TailwindElement, html, when, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement } from 'lit/decorators.js'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { LENs, lockPass, checkNameExists, getInviteCode, getPassCateLen, getPassInfo } from '@/lib/locker'
import emitter from '@lit-web3/core/src/emitter'
import uts46 from 'tr46'
import { ref, createRef } from 'lit/directives/ref.js'
import { unicodelength } from '@lit-web3/ethers/src/stringlength'
// Components
import '@lit-web3/dui/src/connect-wallet/btn'
import '@lit-web3/dui/src/tx-state'
import '@lit-web3/dui/src/dialog'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/doid-symbol'

import style from './lock.css'
@customElement('view-lock')
export class ViewLock extends TailwindElement(style) {
  bindStore: any = new StateController(this, bridgeStore)
  @state() code = ''
  @state() name = ''
  @state() passInfo: any = null
  @state() err: Record<string, string> = { tx: '', name: '', code: '' }
  @state() tip: Record<string, string> = { name: '' }
  @state() nameValid = false
  @state() tx: any = undefined
  @state() pending: Record<string, boolean> = { tx: false, name: false }
  @state() success = false
  @state() inited = false
  @state() dialog = false

  inputNameRef: any = createRef()

  get bridge() {
    return bridgeStore.bridge
  }
  get nextPending() {
    return this.pending.tx || this.pending.name
  }
  get nextDisabled() {
    if (this.passInfo && !this.name) return true
    return (
      this.nextPending || (!this.passInfo && !this.code) || bridgeStore.notReady || this.inputErr || !this.nameValid
    )
  }

  get inputErr() {
    for (let k in this.err) {
      if (k === 'tx') continue
      if (this.err[k]) return true
    }
    return false
  }
  get nameMinLen() {
    return this.passInfo?.len ?? getPassCateLen(this.code)
  }

  close(force = false) {
    this.dialog = false
    this.tx = undefined
    this.resetState(force)
  }

  resetState(all = false) {
    for (let k in this.err) this.err[k] = ''
    for (let k in this.pending) this.pending[k] = false
    this.success = false
    if (all) this.nameValid = false
  }

  async onInputName(e: any) {
    if (bridgeStore.notReady) {
      this.err = { ...this.err, name: `Please connect your wallet first` }
      return
    }
    this.name = e.detail
    this.err = { ...this.err, name: '', tx: '' }
    this.nameValid = false
    if (!this.name) return
    const len = unicodelength(this.name)
    if (len < this.nameMinLen) {
      this.err = { ...this.err, name: ` ${this.nameMinLen} characters required` }
      return
    }
    // Just a tip
    this.tip = { ...this.tip, name: len > this.nameMinLen ? `Minimum ${this.nameMinLen} characters required` : '' }
    const chkUTS: any = uts46.toUnicode(this.name, { useSTD3ASCIIRules: true })
    if (chkUTS.error || /\./.test(chkUTS.domain)) {
      this.err = { ...this.err, name: 'Malformed doid name' }
      return
    }
    this.inputNameRef.value.$('input').value = this.name = chkUTS.domain
    this.name = chkUTS.domain
    this.pending = { ...this.pending, name: true }
    try {
      const taken = await checkNameExists(this.name)
      this.err = { ...this.err, name: taken ? 'Already taken, try another name' : '' }
      this.nameValid = !taken
    } catch (err) {
    } finally {
      this.pending = { ...this.pending, name: false }
    }
  }

  async onInputCode(e: any) {
    this.code = e.detail
    this.err = { ...this.err, code: '', tx: '' }
    const len = this.code.length
    if (len && len < LENs[0]) {
      this.err = { ...this.err, code: 'Invalid or expired invitation code' }
    }
  }

  async signMsg() {
    await getInviteCode()
  }

  async validate(): Promise<boolean> {
    if (this.code || this.passInfo) {
      this.err = { ...this.err, code: '' }
    } else {
      this.err = { ...this.err, code: 'Required' }
    }
    return !this.inputErr
  }

  async next() {
    if (!(await this.validate())) return
    this.resetState()
    this.pending = { ...this.pending, tx: true }
    try {
      this.tx = await lockPass(this.passInfo || this.code, this.name)
      this.dialog = true
      this.success = await this.tx.wait()
      // emitter.emit('router-goto', '/passes')
    } catch (err: any) {
      let msg = err.message || err.code
      if (err.code === 4001) {
        this.err = { ...this.err, tx: msg }
        return this.close()
      }
      if (this.passInfo) {
        this.close(true)
      }
      if (/( IC| IR| II|arrayify|minted)/.test(msg)) {
        this.err = { ...this.err, code: 'Invalid or expired invitation code' }
      } else if (/( IU)/.test(msg)) {
        this.err = { ...this.err, code: 'One wallet address can only activate one invitation code' }
      } else if (/( IV| AL| IN)/.test(msg)) this.err = { ...this.err, name: 'Already taken, try another name' }
    } finally {
      this.pending = { ...this.pending, tx: false }
    }
  }

  firstUpdated() {}

  async connectedCallback() {
    super.connectedCallback()
    const { searchParams } = new URL(location.href)
    const reqIC = searchParams.get('ic')
    if (reqIC) {
      this.code = reqIC
    } else {
      const reqPID = searchParams.get('pid')
      if (reqPID) {
        this.passInfo = {}
        try {
          const info = await getPassInfo(reqPID)
          if (info.name) return emitter.emit('router-replace', '/passes')
          this.passInfo = info
        } catch (e) {
          location.href = '/'
        }
      }
    }
  }

  render() {
    return html`<div class="name-locker py-4">
      <div class="dui-container">
        <doid-symbol>
          <span slot="h1">Mint your lock pass and lock your desired DOID name now for free</span>
        </doid-symbol>
        <!-- Inputs -->
        <!-- Code -->
        <div class="my-0 mx-auto text-center">
          ${when(
            this.passInfo,
            () =>
              html`<p class="px-3 mt-8 mb-4 w-full lg_w-96 text-left mx-auto">
                Lock Pass ID: <b class="text-base">#${this.passInfo.id}</b>
              </p>`,
            () => html`<dui-input-text
              @input=${this.onInputCode}
              value=${this.code}
              placeholder="Enter your invitation code"
              required
              ?disabled=${this.pending.tx}
            >
              <span slot="label">Invitation Code</span>
              <span slot="tip">
                <dui-link href="/help">get invitation</dui-link>
              </span>
              <span slot="msg">
                ${when(this.err.code, () => html`<span class="text-red-500">${this.err.code}</span>`)}
              </span>
            </dui-input-text>`
          )}
        </div>
        <!-- Name -->
        <div class="my-0 mx-auto text-center">
          <dui-input-text
            ${ref(this.inputNameRef)}
            @input=${this.onInputName}
            value=${this.name}
            placeholder="e.g. vitalik"
            ?required=${this.passInfo}
            ?disabled=${this.pending.tx}
          >
            <span slot="label">Name you wish to lock</span>
            <span slot="right">
              <p class="flex gap-2">
                ${when(this.pending.name, () => html`<i class="mdi mdi-loading"></i>`)}
                ${when(this.nameValid, () => html`<i class="mdi mdi-check text-green-500"></i>`)}
                <b>.doid</b>
              </p>
            </span>
            <span slot="msg">
              ${when(
                this.err.name,
                () => html`<span class="text-red-500">${this.err.name}</span>`,
                () =>
                  html`${when(
                    this.tip.name,
                    () => html`<span class="text-orange-500">${this.tip.name}</span>`,
                    () => html``
                  )}`
              )}
            </span>
          </dui-input-text>
        </div>

        ${when(
          bridgeStore.noAccount,
          // Locked
          () => html`<p class="my-8 text-center"><connect-wallet-btn></connect-wallet-btn></p>
            <p class="text-xs w-full lg_w-2/5 my-8 mx-auto">
              DOID<br />
              YOUR DECENTRALIZED OPENID<br />SAFER FASTER AND EASIER ENTRANCE TO CHAINS, CONTACTS AND DAPPS
            </p>`,
          // Unlocked
          () => html`<div class="my-8 text-center">
              <dui-button ?disabled=${this.nextDisabled} ?pending=${this.nextPending} @click=${this.next}>
                <span class="flex justify-center items-center">
                  <span>Next</span>
                  <i class="mdi -mr-1 ml-1 ${this.nextPending ? 'mdi-loading' : 'mdi-chevron-right'}"></i>
                </span>
              </dui-button>
              <p class="mt-4 w-64 text-xs mx-auto text-red-500 break-words">${this.err.tx}</p>
            </div>
            <p class="text-xs w-full my-8 mt-12 mx-auto text-center break-words">
              Note: If your transaction reverted due to name confliction, your lock pass NFT will still be available for
              other names later.
            </p>`
        )}

        <!-- Tx Dialog -->
        ${when(
          this.dialog,
          () => html`<dui-dialog @close=${this.close}>
            <div slot="header">Locking your awesome name</div>
            <!-- Content -->
            <div class="min-h-10">
              <div class="text-center">
                ${when(
                  this.name,
                  () => html`You are locking for:
                    <p class="text-black text-base"><b class="text-blue-600">${this.name}</b>.doid</p>`,
                  () =>
                    html`You are minting passes without a name,<br />
                      you can lock them later`
                )}
              </div>
              ${when(
                this.tx && !this.tx.ignored,
                () => html`<tx-state
                  .tx=${this.tx}
                  .opts=${{ state: { success: 'Success. Your name has been locked.' } }}
                  ><dui-button slot="view" href="/passes">View My Pass</dui-button></tx-state
                >`,
                () => html``
              )}
            </div>
            <!-- Bottom -->
          </dui-dialog>`
        )}
      </div>
    </div>`
  }
}
