import {
  TailwindElement,
  html,
  customElement,
  when,
  property,
  state,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'

import style from './restore.css?inline'
@customElement('view-restore')
export class ViewRestore extends TailwindElement(style) {
  @property() placeholder = ''
  @state() pwd = ''
  @state() err = ''
  @state() pending = false
  @state() phrases = new Array(12)

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }

  submit() {}
  render() {
    return html`<div class="restore">
      <div class="dui-container">
        <div class="flex items-center">
          <dui-link back class="link"><i class="mdi mdi-arrow-left"></i>Back</dui-link>
        </div>
        <h1 class="my-4 text-4xl">Restore wallet</h1>
        <h3 class="text-lg">Secret Recovery Phrase</h3>
        <div class="grid grid-cols-3 gap-4 m-4">
          ${repeat(
            this.phrases,
            (phrase, i) => html`<div class="flex items-center gap-4">
              <b class="block w-4">${i + 1}.</b>
              <dui-input-text
                dense
                ?autoforce=${i === 0}
                type="password"
                @input=${this.onInput}
                @submit=${this.submit}
                value=${this.pwd}
                ?disabled=${this.pending}
              >
              </dui-input-text>
            </div>`
          )}
        </div>
        <div class="my-2">
          <dui-button class="secondary" block>Restore</dui-button>
        </div>
      </div>
    </div>`
  }
}
