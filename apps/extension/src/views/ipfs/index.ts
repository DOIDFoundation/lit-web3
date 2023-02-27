import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { toHex } from 'ethereum-cryptography/utils'
import { HDKey } from 'ethereum-cryptography/hdkey'
import ipfs from 'ipfs-http-client'
import { arrToBufArr, bufferToHex, publicToAddress } from 'ethereumjs-util'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './ipfs.css?inline'
@customElement('view-ipfs')
export class ViewIPFS extends TailwindElement(style) {
  @property() placeholder = 'Secret Recovery Phrase'
  @state() pwd = 'swear type number garlic physical mean voice island report typical multiply holiday'
  @state() err = ''
  @state() pending = false
  @state() seed =
    '032475b1110d62ec18746aaf6681372e0b862e526b0a0b710875f7fc9d7b9e1b57bedf794f67fea936c749e585b8887fc0fc01884dbd83a9e06bf93dd26ed179'
  @state() ethAddress = ''

  onInput = async (e: CustomEvent) => {
    let error = validateMnemonic(e.detail, wordlist)
    this.err = error ? '' : 'Bad mnemonic'
    if (!error) return
    this.pwd = e.detail
    let seed = await mnemonicToSeed(this.pwd)
    this.seed = toHex(seed)
    let key = HDKey.fromMasterSeed(seed)
    // let pubKey = key.derive(`m/44'/60'/0'/0`).publicKey
    // this.ethAddress = bufferToHex(publicToAddress(arrToBufArr(pubKey!), true)).toLowerCase()
    console.log("11111111111111111111")
    console.log(
      this.pwd,
      this.seed,
      toHex(key.derive(`m/44'/60'/0'/0`).publicKey!),
      key.derive(`m/44'/60'/0'/0`).publicKey
    )
  }

  submit() {}
  render() {
    return html`<div class="unlock">
      <div class="dui-container">
        <div class="dui-container">
          <div class="max-w-xs mx-auto">
            <dui-input-text
              autoforce
              @input=${this.onInput}
              @submit=${this.submit}
              value=${this.pwd}
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
            <div class="my-2">seed:<br />${this.seed}</div>
            <div class="my-2">ETH:<br />${this.ethAddress}</div>
          </div>
        </div>
      </div>
    </div>`
  }
}
