import { TailwindElement, html, customElement, property, when, classMap } from '../shared/TailwindElement'
import { LazyElement } from '../shared/LazyElement'

// Components
import '../link'
// Styles
import style from './index.css?inline'
@customElement('dui-pagination')
export class DuiPagination extends LazyElement(TailwindElement(style), { persistent: true }) {
  @property() pageSize = 10
  @property() page = 1
  @property() mode = 'scroll' //scroll or click auto
  @property() pending? = false
  @property() all = false // all loaded
  @property() class = ''

  get nomore() {
    return this.all === true
  }
  get enable() {
    return !this.pending && !this.nomore
  }
  get scrollMode() {
    return this.mode === 'scroll'
  }
  loadmore() {
    if (!this.enable) return
    const { pageSize, page, mode } = this
    this.emit('loadmore', { pageSize, page, mode })
  }
  connectedCallback() {
    super.connectedCallback()
  }
  override onObserved = () => {
    this.loadmore()
  }
  // nomore
  // loading
  render() {
    return html`<div
      class="dui-pagination w-full flex justify-center items-center mt-4 ${classMap(
        this.$c([{ nomore: this.nomore }, this.class])
      )}"
    >
      <div
        part="inner"
        @click="${this.loadmore}"
        class=${classMap({
          'cursor-not-allowed': this.nomore,
          'cursor-wait': !!this.pending,
          'cursor-pointer': this.enable
        })}
      >
        ${when(
          this.nomore,
          () => html` <slot name="nomore"><span class="text-gray-400">No more</span></slot>`,
          () =>
            html`${when(
              this.pending,
              () => html` <slot name="loading"><i class="mdi mdi-loading ml-1"></i></slot>`,
              () => html`${when(this.scrollMode, () => html`<slot><dui-link>Load more</dui-link></slot>`)}`
            )}`
        )}
      </div>
    </div>`
  }
}
