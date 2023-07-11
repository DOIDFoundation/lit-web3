import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'

import { Mnemonic, HDNodeWallet, toBeArray } from 'ethers'
import { AptosAccount } from 'aptos'
import { Keypair as SolanaKeyPair } from '@solana/web3.js'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './seed.css?inline'
@customElement('view-seed')
export class ViewSeed extends TailwindElement(style) {
  @property() placeholder = 'Secret Recovery Phrase'
  @state() pwd = null
  @state() phrase = 'hold scale hybrid tank dilemma bullet ship language attitude rug tennis host'
  @state() err = ''
  @state() pending = false
  @state() seed =
    '032475b1110d62ec18746aaf6681372e0b862e526b0a0b710875f7fc9d7b9e1b57bedf794f67fea936c749e585b8887fc0fc01884dbd83a9e06bf93dd26ed179'
  @state() publicKey = ''
  @state() ethAddress = ''
  @state() solanaAddress = ''
  @state() aptosAddress = ''

  onInput = async (e: CustomEvent) => {
    const _phrase = e.detail.trim()
    this.err = Mnemonic.isValidMnemonic(_phrase) ? '' : 'Bad mnemonic'
    if (this.err) return
    this.phrase = _phrase
    this.calc()
  }

  calc = async () => {
    // Wallet
    const mnemnoic = Mnemonic.fromPhrase(this.phrase, this.pwd)
    this.seed = mnemnoic.computeSeed()
    const wallet = HDNodeWallet.fromMnemonic(mnemnoic)
    this.publicKey = wallet.publicKey

    // ETH
    this.ethAddress = wallet.address

    // Aptos
    let aptWallet = AptosAccount.fromDerivePath(`m/44'/637'/0'/0'/0'`, this.phrase)
    //result ritual leaf ski slab coral pitch grain deposit govern swim bag
    this.aptosAddress = aptWallet.address().hex()

    // Solana
    let solanaWallet = SolanaKeyPair.fromSeed(toBeArray(this.seed).slice(0, 32))
    this.solanaAddress = solanaWallet.publicKey.toBase58()
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.calc()
  }

  render() {
    return html`<div class="unlock">
      <div class="dui-container">
        <div class="dui-container">
          <div class="mx-auto">
            <dui-input-text
              @input=${this.onInput}
              value=${this.phrase}
              placeholder=${this.placeholder}
              ?disabled=${this.pending}
            >
              <span slot="label"><slot name="label"></slot></span>
              <span slot="msg">
                ${when(
                  this.err,
                  () => html`<span class="text-red-500">${this.err}</span>`,
                  () => html`<slot name="msg"></slot>`
                )}
              </span>
            </dui-input-text>
            <div class="my-2"><b>Seed: </b>${this.seed}</div>
            <div class="my-2"><b>CompressedPublicKey: </b>${this.publicKey}</div>
            <hr />
            <div class="my-2"><b>ETH: </b>${this.ethAddress}</div>
            <div class="my-2"><b>Solana: </b>${this.solanaAddress}</div>
            <div class="my-2"><b>Aptos: </b>${this.aptosAddress}</div>
          </div>
        </div>
      </div>
    </div>`
  }
}
