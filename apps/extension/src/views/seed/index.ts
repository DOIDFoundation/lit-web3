import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { toHex } from 'ethereum-cryptography/utils'
import { HDKey } from 'ethereum-cryptography/hdkey'
import { arrToBufArr, bufferToHex, privateToPublic, publicToAddress } from 'ethereumjs-util'
// import { mnemonicToSeed } from 'bip39'
// import { hdkey } from 'ethereumjs-wallet'
// import { bufferToHex } from 'ethereumjs-util'
import { nacl } from 'tweetnacl' // nacl
import { derivePath } from 'ed25519-hd-key'
import { bs58 } from 'bs58'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { getPublicKey } from 'ethereum-cryptography/secp256k1'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { AptosAccount } from 'aptos'
import { Keypair } from '@solana/web3.js'
import * as bip39 from 'bip39'

import {
  bufferToHex,
  privateToAddress,
  publicToAddress,
  toChecksumAddress,
  privateToPublic,
  importPublic,
  isValidPrivate,
  isValidPublic
} from '@ethereumjs/util'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './seed.css?inline'
@customElement('view-seed')
export class ViewSeed extends TailwindElement(style) {
  @property() placeholder = 'Secret Recovery Phrase'
  @state() pwd = 'hold scale hybrid tank dilemma bullet ship language attitude rug tennis host'
  @state() err = ''
  @state() pending = false
  @state() seed =
    '032475b1110d62ec18746aaf6681372e0b862e526b0a0b710875f7fc9d7b9e1b57bedf794f67fea936c749e585b8887fc0fc01884dbd83a9e06bf93dd26ed179'
  @state() ethAddress = ''
  @state() solanaAddress = ''
  @state() aptosAddress = ''

  onInput = async (e: CustomEvent) => {
    let error = validateMnemonic(e.detail, wordlist)
    console.log(e.detail, '----------')
    this.err = error ? '' : 'Bad mnemonic'
    if (!error) return
    this.pwd = e.detail
    let seed = await mnemonicToSeed(this.pwd)
    this.seed = toHex(seed)
    let key = HDKey.fromMasterSeed(seed)
    let pubKey = key.derive(`m/44'/60'/0'/0/0`).publicKey

    let ethAddress = bufferToHex(publicToAddress(Buffer.from(pubKey), true)).toLowerCase()

    let apt = AptosAccount.fromDerivePath(`m/44'/637'/0'/0'/0'`, this.pwd)

    //result ritual leaf ski slab coral pitch grain deposit govern swim bag
    this.aptosAddress = apt.address().hex()

    let keypair = Keypair.fromSeed(seed.slice(0, 32))
    console.log(`${keypair.publicKey.toBase58()}`) //
    // const derivedSeed = derivePath("m/44'/501'/0'/0'", this.seed).key
    // // 得到私钥和地址
    // let privateKey = bs58.encode(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey)
    // let address = bs58.encode(nacl.sign.keyPair.fromSeed(derivedSeed).publicKey)
    this.solanaAddress = keypair.publicKey.toBase58()
    // let derivationPath = `m/44'/637'/0'/0'/0'`
    // let seed = await mnemonicToSeed('hold scale hybrid tank dilemma bullet ship language attitude rug tennis host')
    // this.seed = bufferToHex(seed)
    // console.log(this.seed)
    // // let hdWallet = await hdkey.fromMasterSeed(seed)

    // let derivePath2 = "m/44'/501'/0'/0'"
    // let derivedSeed = derivePath(derivePath2, seed.toString('hex')).key

    // this.ethAddress = derivedSeed //toHex(key2._hdkey._publicKey)

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
            <div class="my-2">Solana:<br />${this.solanaAddress}</div>
            <div class="my-2">Aptos:<br />${this.aptosAddress}</div>
          </div>
        </div>
      </div>
    </div>`
  }
}
