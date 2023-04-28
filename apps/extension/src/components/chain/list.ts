import {
  TailwindElement,
  html,
  customElement,
  state,
  property,
  repeat,
  classMap,
  styleMap
} from '@lit-web3/dui/src/shared/TailwindElement'

import { chainsDefault, ChainName, ChainCoin } from '~/lib.next/chain'

import style from './chain.css?inline'
@customElement('network-list')
export class networkList extends TailwindElement(style) {
  @property() class = ''
  @state() index = 0

  @state() userChains = [
    // { name: ChainName.bitcoin, title: 'Bitcoin', coin: ChainCoin.bitcoin }
  ] as ChainNet[]

  get allChains() {
    return chainsDefault.concat(this.userChains)
  }
  get chain() {
    return this.allChains[this.index]
  }

  switch = (idx: number) => {
    this.index = idx
    this.emit('switch', { ...this.chain })
  }
  addChain = () => {}

  connectedCallback() {
    this.emit('switch', { ...this.chain })
    super.connectedCallback()
  }

  render() {
    return html`<div class="flex flex-col justify-center items-center ${classMap(this.$c([this.class]))}">
      ${repeat(
        this.allChains,
        (net: any, idx) =>
          html`<div
            class="chain-tab ${classMap({ active: net.name === this.chain.name })}"
            @click=${() => this.switch(idx)}
          >
            <div class="chain-icon inline-flex justify-center items-center ${net?.coin}">
              <!-- ${net.name.charAt(0)} -->
            </div>
          </div>`
      )}

      <!-- <div
        class="m-2 w-10 h-10 rounded-full bg-gray-300 inline-flex justify-center items-center text-2xl text-white"
        @click=${this.addChain}
      >
        <i class="mdi mdi-plus"></i>
      </div> -->
    </div>`
  }
}
