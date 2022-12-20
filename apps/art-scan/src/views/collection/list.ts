import { TailwindElement, html, when, repeat } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement, state } from 'lit/decorators.js'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'

// Components
import '@lit-web3/dui/src/connect-wallet/btn'
import '@lit-web3/dui/src/button'
import './item'
import './searchInput'

// Style
import style from './style.css?inline'

@customElement('view-collections')
export class ViewCollections extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() keyword = ''
  @state() pending = false
  @state() ts = 0
  @state() collections: any[] = []

  get bridge() {
    return bridgeStore.bridge
  }

  response2Json = (response: any) => {
    return response
      .json()
      .catch((err: any) => {
        throw { error: err, message: 'Malformed JSON' }
      })
      .then(function (res: any) {
        var data = res.data || res.result || res
        return data
      })
  }
  async getUserCollections() {
    if (bridgeStore.notReady) return
    if (!this.keyword) return
    let _that = this
    this.pending = true
    try {
      const url = `https://api.opensea.io/api/v1/assets?owner=${this.keyword}`
      await new Promise((resolve, reject) => {
        fetch(`${url}`, {
          method: 'GET'
        })
          .then(this.response2Json)
          .then(resolve, reject)
      })
        .then(function (res: any) {
          _that.collections = res.assets.map((item: any) => {
            const {
              creator: {
                address,
                user: { username }
              },
              token_id,
              collection: { name, description, image_url, created_date }
            } = item
            return {
              name,
              description,
              token_id,
              image: image_url,
              username,
              creator: address,
              createAt: created_date
            }
          })
        })
        .catch((err) => {
          console.error(err)
        })
    } catch (e) {
    } finally {
      this.pending = false
      this.ts++
    }
  }

  get empty() {
    return this.ts && !this.collections.length
  }

  connectedCallback() {
    super.connectedCallback()
    const { searchParams } = new URL(location.href)
    const reqKey = searchParams.get('ik')
    if (reqKey) this.keyword = reqKey
    this.getUserCollections()
  }
  render() {
    return html`<div>
      <div class="dui-container my-8">
        <search-input .text=${this.keyword}></search-input>
        ${when(
          bridgeStore.noAccount,
          () => html`<div class="my-8 text-center"><connect-wallet-btn></connect-wallet-btn></div>`,
          () => html`<section>
            <div class="py-4">
              ${when(
                this.empty,
                () => html`No collection yet.`,
                () =>
                  html`${when(
                    this.pending,
                    () => html`<i class="mdi mdi-loading mr-1"></i>Loading...`,
                    () => html`<div class="coll-list">
                      ${repeat(
                        this.collections,
                        (item: any) => html`<coll-item key="${item.token_id}" .item=${item}></coll-item>`
                      )}
                    </div>`
                  )}`
              )}
            </div>
          </section>`
        )}
      </div>
    </div>`
  }
}
