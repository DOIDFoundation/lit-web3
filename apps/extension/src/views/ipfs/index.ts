import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { toHex } from 'ethereum-cryptography/utils'
import { HDKey } from 'ethereum-cryptography/hdkey'
import { keys } from '@libp2p/crypto'
import * as w3name from 'w3name'
import { Web3Storage } from 'web3.storage'

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
  @state() seed = ''
  @state() ipnsCID = ''
  @state() ipnsValue = ''
  @state() ipfsFile = ''
  @state() ipfsCID = ''

  onInput = async (e: CustomEvent) => {
    let error = validateMnemonic(e.detail, wordlist)
    this.err = error ? '' : 'Bad mnemonic'
    if (!error) return
    this.pwd = e.detail
  }

  resolveIPNS = async (e: CustomEvent) => {
    let seed = await mnemonicToSeed(this.pwd)
    this.seed = toHex(seed)
    let key = HDKey.fromMasterSeed(seed)
    let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)

    const name = await w3name.from(ipfsKey.bytes)
    this.ipnsCID = name.toString()
    console.log('ipns: ', this.ipnsCID)

    try {
      let revision = await w3name.resolve(name)
      console.debug(revision)
      this.ipnsValue = revision.value
    } catch (e) {
      this.ipnsValue = 'not found'
      return
    }
    console.log('Resolved value:', this.ipnsValue)

    let configFile = await fetch(`https://w3s.link/ipfs/${this.ipnsValue}/doid.json`)
    if (!configFile.ok) {
      console.error(`${this.ipnsValue}/doid.json not found`, configFile.status)
      return
    }
    this.ipfsFile = await configFile.text()
  }

  onInputFile = async (e: CustomEvent) => {
    this.ipfsFile = e.detail
  }

  updateIPNS = async (e: CustomEvent) => {
    const files = [new File([this.ipfsFile], 'doid.json')]

    let storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })
    let cid = await storage.put(files, { name: `testing files for ${this.ipnsCID}` })
    this.ipfsCID = cid.toString()
    console.log('stored files with cid:', this.ipfsCID)

    let seed = await mnemonicToSeed(this.pwd)
    let key = HDKey.fromMasterSeed(seed)
    let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)
    const name = await w3name.from(ipfsKey.bytes)
    const revision = await w3name.resolve(name)
    const nextRevision = await w3name.increment(revision, cid.toString())
    await w3name.publish(nextRevision, name.key)
  }

  render() {
    return html`<div class="unlock">
      <div class="dui-container">
        <div class="dui-container">
          <div class="max-w-xs mx-auto">
            <dui-input-text
              autoforce
              @input=${this.onInput}
              @submit=${this.resolveIPNS}
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
            <div class="my-2">
              <dui-button class="block w-full secondary !rounded-full h-12" block @click=${this.resolveIPNS}
                >Resolve IPNS</dui-button
              >
            </div>
            <div class="my-2">seed:<br />${this.seed}</div>
            <div class="my-2">ipns CID:<br />${this.ipnsCID}</div>
            <div class="my-2">ipns Value:<br />${this.ipnsValue}</div>
            <dui-input-text autoforce @input=${this.onInputFile} value=${this.ipfsFile}> </dui-input-text>
            <div class="my-2">
              <dui-button class="block w-full secondary !rounded-full h-12" block @click=${this.updateIPNS}
                >Update IPNS</dui-button
              >
            </div>
            <div class="my-2">ipfs CID:<br />${this.ipfsCID}</div>
          </div>
        </div>
      </div>
    </div>`
  }
}
