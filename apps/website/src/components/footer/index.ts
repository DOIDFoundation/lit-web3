import { ThemeElement, html, customElement, when } from '@lit-web3/dui/shared/theme-element'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { screenStore } from '@lit-web3/base/screen'
import style from './style.css?inline'

@customElement('ui-footer')
export class UIFooter extends ThemeElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  render() {
    return html`<div class="footer-cnt">
      <slot name="top">
        <div class="wrapper grid grid-cols-1 lg_grid-cols-8 gap-x-24 pt-16">
          <div class="lg_col-span-5">
            <h2 class="sub-ttl">whitepaper</h2>
            <div class="sub-cnt gap-6 lg_gap-12 flex-col lg_flex-row h-auto">
              <a
                class="btn btn1"
                href="https://github.com/DOIDFoundation/doid.tech/blob/main/whitepaper/doid-0.1.0.pdf"
                target="_blank"
                >DOID Protocol</a
              >
              <a
                class="btn btn1"
                href="https://github.com/DOIDFoundation/doid.tech/blob/main/whitepaper/doid-bridge-0.1.2.pdf"
                target="_blank"
                >DCCP Protocol</a
              >
            </div>
          </div>
          <div class="lg_col-span-3">
            <h2 class="sub-ttl">Community</h2>
            <div class="sub-cnt gap-10">
              <a class="ico i1" href="https://github.com/DOIDFoundation" target="_blank"></a>
              <a class="ico i2" href="https://twitter.com/DoidFoundation" target="_blank"></a>
              <a class="ico i3" href="https://discord.gg/N9emnzwAzm" target="_blank"></a>
              <a class="ico i4" href="https://medium.com/@DOID" target="_blank"></a>
            </div>
          </div>
        </div>
      </slot>

      <slot name="middle">
        <div class="wrapper lg_mt-16 pb-12 lg_pb-16">
          <h2 class="sub-ttl">about DOID TEAM</h2>
          <p class="text text-sm lg_text-2xl pt-4">
            The founding team is a multidisciplinary expertise in tech, internet and finance. We come from Ripple,
            Uniswap, Ethereum, Zcoin, Monero, Eos, Microsoft, Moody's, Evernote.
          </p>
        </div>
      </slot>
      <slot name="bottom">
        <div class="lg_mt-16">
          <div class="wrapper border-t border-white">
            <div class="sub-cnt">
              ${when(!screenStore.isMobi, () => html`<a class="logo-ico" href="/"></a>`)}
              <span class="copy-right text text-xs lg_text-2xl">©Copyright DOID Network. All Rights Reserved</span>
            </div>
          </div>
        </div>
      </slot>
    </div>`
  }
}
