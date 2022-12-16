import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/ns-search'

// Style
import style from './index.css'
import emitter from '@lit-web3/core/src/emitter'

@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  go2Search(e: Event) {
    console.info('goto search')
    e.stopImmediatePropagation()
    emitter.emit('go2search')
  }
  render() {
    return html`<div class="home">
      <div class="dui-container">
        <dui-ns-search placeholder="DOID of artist or artwork">
          <span slot="label">DOID of artist or artwork</span>
          <div slot="right">
            <p class="flex gap-2">
              <i class="mdi mdi-arrow-right-circle-outline text-blue-500 text-lg" @click=${this.go2Search}></i>
            </p>
          </div>
          <span slot="tip"></span>
        </dui-ns-search>
      </div>
    </div>`
  }
}
