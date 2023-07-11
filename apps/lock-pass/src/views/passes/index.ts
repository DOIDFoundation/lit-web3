import { TailwindElement, html, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { getPasses, getPassCates, getNameByHash, getLockerContract } from '~/lib/locker'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { formatUnits } from 'ethers'
// Components
import '@lit-web3/dui/src/connect-wallet/btn'
import '@lit-web3/dui/src/loading/icon'
import '@lit-web3/dui/src/link'
import './share'
import './item'

// import { Contract } from '@lit-web3/ethers/src/multiCall/ethers-multicall'

import style from './list.css?inline'
@customElement('view-passes')
export class ViewPasses extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property() name = ''
  @state() passes: any[] = []
  @state() pending = false
  @state() ts = 0

  get bridge() {
    return bridgeStore.bridge
  }

  async getUserPassList() {
    if (bridgeStore.notReady) return
    this.pending = true
    const { account } = bridgeStore.bridge
    const contract = await getLockerContract()
    try {
      const res = await getPasses(account, true)
      const passCate = await getPassCates()
      let cooked = await Promise.all(
        res.map(async (r: any) => {
          const [id, cate, hash] = r
          const passId = formatUnits(id, 0)
          const passcate = passCate[cate] ?? []
          const cooked: Record<string, any> = { id: passId, cate: passcate[0], hash, meta: {} }
          const res = await Promise.all([getNameByHash(hash), contract.tokenURI(passId)])
          cooked.name = res[0]
          cooked.len = `${passcate[1]}`
          // Meta
          try {
            cooked.meta = await (await fetch(res[1])).json()
          } catch {}
          return cooked
        })
      )
      this.passes = cooked
        .sort((a: any, b: any) => a.id - b.id)
        .sort((a: any, b: any) => {
          return a.name ? (b.name ? a.id - b.id : -1) : 1
        })
    } catch (err) {
      console.log(err, 'get passess failed')
      this.passes = []
    } finally {
      this.ts++
      this.pending = false
    }
  }

  get empty() {
    return this.ts && !this.passes.length
  }

  connectedCallback() {
    super.connectedCallback()
    this.getUserPassList()
  }

  render() {
    return html`<div class="passes py-4">
      <div class="lg_w-3/5 my-8 mx-3 lg_mx-auto">
        <section>
          <p class="text-base mb-2">Note</p>
          <ul class="note list-disc mx-4">
            <li>You can only mint one Lock Pass for one wallet address.</li>
            <li>
              Once you successfully locked your name. Your name will be reserved for 7 days after the official
              launch(22nd Dec,2022). Those locked but unminted names will be released to the public pool afterwards.
            </li>
          </ul>
          <dui-link
            href=${import.meta.env.VITE_APP_TWITTER}
            target="_blank"
            rel="noopener"
            class="inline-flex my-1 text-base"
            >Follow DOID Twitter and stay connected</dui-link
          >
        </section>

        ${when(
          bridgeStore.noAccount,
          // Locked
          () => html`<div class="my-8 text-center"><connect-wallet-btn></connect-wallet-btn></div>`,
          // Unlocked
          () => html`<section class="mt-6">
              <h2 class="my-4 text-xl">My Lock Pass</h2>
              <div class="py-4">
                ${when(
                  this.empty,
                  // Empty
                  () => html`No passes yet.`,
                  () =>
                    html`${when(
                      this.pending,
                      // Loading
                      () => html`<loading-icon></loading-icon>`,
                      // List
                      () => html`<div class="pass-list grid md_grid-cols-2 gap-4">
                        ${repeat(
                          this.passes,
                          (item: any) =>
                            html`<pass-item @change=${this.getUserPassList} key=${item.id} .item=${item}></pass-item>`
                        )}
                      </div>`
                    )}`
                )}
              </div>
            </section>
            <section class="mt-6">
              <h2 class="text-xl mb-2">Share Lock Pass Invitations</h2>
              ${this.passes.length ? html` <pass-share></pass-share>` : html``}
            </section>`
        )}
      </div>
    </div>`
  }
}
