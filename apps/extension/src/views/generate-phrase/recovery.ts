import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './phrase.css?inline'
import { goto } from '@lit-web3/dui/src/shared/router'
import { doidController } from '@/lib/keyringController'
@customElement('view-recovery')
export class ViewAddress extends TailwindElement(style) {
  constructor() {
    super()
    // this.initPhrase()
  }
  @property() phrase = ''
  @property() placeholder = 'Password'
  @state() phraseElements: string[] = []
  @state() validate = false
  @state() randomPhrase: { name: String; active: Boolean }[] = []

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    // this.err = msg
    if (error) return
    // this.pwd = val
  }
  routeGoto = (path: string) => {
    goto(`/generate-phrase/${path}`)
  }
  // gas punch sport hen claim click scene employ zoo catch luxury east
  initPhrase = () => {
    const _phrase = this.phrase.split(' ')
    // ? this.phrase
    // : 'report ill kick deer daughter spice puppy shine bean corn forget protec'.split(' ')
    console.log(this.phrase, '_phrase')
    const _randomPhrase = _phrase.sort(() => (Math.random() > 0.5 ? -1 : 1))
    _randomPhrase.forEach((item: string) => {
      this.randomPhrase.push({ name: item, active: false })
    })
    console.log(this.randomPhrase)
  }
  connectedCallback() {
    super.connectedCallback()
    this.initPhrase()
  }
  onRecovery = (item: any) => {
    if (!item.active) {
      this.phraseElements.push(item.name)
    } else {
      const idx = this.phraseElements.indexOf(item.name)
      this.phraseElements.splice(idx, 1)
    }
    this.validate = this.phrase === this.phraseElements.join(' ')
    console.log(this.phraseString)
    item.active = !item.active
    this.phraseElements = this.phraseElements.splice(0)
    // this.requestUpdate('phraseElements')
  }
  get phraseString() {
    return this.phraseElements.join(' ')
  }
  submit = async () => {
    const res = await doidController.keyringController.memStore.getState()
    console.log(res, 'memStore')
  }
  render() {
    return html` <div class="dui-container">
      <div class="text-lg font-bold mt-2 text-center">Confirm Secret Recovery Phrase</div>
      <div class="mt-2 ">
        <textarea class="border rounded-md w-full h-24 p-2" .value=${this.phraseString}></textarea>
      </div>
      <div class="mt-2 text-center flex flex-wrap">
        ${this.randomPhrase.map(
          (item) =>
            html`<div
              class="p-2 my-2 cursor-pointer mr-2 ${item.active ? 'bg-blue-600 text-white' : 'bg-gray-300'}"
              @click=${() => this.onRecovery(item)}
            >
              ${item.name}
            </div>`
        )}
      </div>
      <!-- <div>${this.phraseElements}----</div> -->
      <div class="mt-4 flex justify-between">
        <dui-button
          @click=${() => this.routeGoto('generate-addresses')}
          class="!rounded-full h-12 outlined w-12 !border-gray-500 "
          ><i class="mdi mdi-arrow-left text-gray-500"></i
        ></dui-button>
        <dui-button
          .disabled="${!this.validate}"
          @click=${() => this.submit()}
          class="secondary !rounded-full h-12 w-12"
          ><i class="mdi mdi-arrow-right"></i
        ></dui-button>
      </div>
    </div>`
  }
}
