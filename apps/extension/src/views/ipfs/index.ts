import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { toHex } from 'ethereum-cryptography/utils'
import { HDKey } from 'ethereum-cryptography/hdkey'
// import * as IpfsHttpClient from 'ipfs-http-client'
// import * as ipns from 'ipns'
// import * as IPFS from 'ipfs-core'
import * as w3name from 'w3name'

// import { WebSockets } from '@libp2p/websockets'
// import * as filters from '@libp2p/websockets/filters'
// import { arrToBufArr, bufferToHex, publicToAddress } from '@ethereumjs/util'
import { keys } from '@libp2p/crypto'

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

  onInput = async (e: CustomEvent) => {
    let error = validateMnemonic(e.detail, wordlist)
    this.err = error ? '' : 'Bad mnemonic'
    if (!error) return
    this.pwd = e.detail
  }

  submit = async (e: CustomEvent) => {
    let seed = await mnemonicToSeed(this.pwd)
    this.seed = toHex(seed)
    let key = HDKey.fromMasterSeed(seed)
    // let pubKey = key.derive(`m/44'/60'/0'/0`).publicKey
    // this.ethAddress = bufferToHex(publicToAddress(arrToBufArr(pubKey!), true)).toLowerCase()
    console.log(
      this.pwd,
      this.seed,
      key.privateKey,
      toHex(key.derive(`m/44'/60'/0'/0`).publicKey!),
      key.derive(`m/44'/60'/0'/0`).publicKey
    )

    let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)

    const name = await w3name.from(ipfsKey.bytes)
    this.ipnsCID = name.toString()

    console.log('created new name: ', name.toString())
    const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    // since we don't have a previous revision, we use Name.v0 to create the initial revision
    // const revision = await w3name.v0(name, value)
    // await w3name.publish(revision, name.key)
    try {
      this.ipnsValue = (await w3name.resolve(w3name.parse(name.toString()))).value
    } catch (e) {
      this.ipnsValue = 'not found'
    }
    console.log('Resolved value:', this.ipnsValue)
    return

    // let ipfsPem = await ipfsKey.export('abc')
    // console.log(ipfsKey, ipfsPem)
    // // let ipfs = create()
    // // let importedKey = await ipfs.key.import('ipns', ipfsPem, 'abc')
    // // const addr = '/ipfs/QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp'
    // // const res = await ipfs.name.publish(addr, { key: 'ipns' })
    // // console.log(`https://gateway.ipfs.io/ipns/${res.name}`)

    // console.debug(`Browser IPFS getting ready...`)
    // let ipfsNode = await IPFS.create({
    //   // pass: '01234567890123456789'
    //   // config: {
    //   //   Addresses: {
    //   //     Swarm: [
    //   //       '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
    //   //       '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
    //   //     ],
    //   //     Delegates: [
    //   //       '/dns4/node0.delegate.ipfs.io/tcp/443/https',
    //   //       '/dns4/node1.delegate.ipfs.io/tcp/443/https',
    //   //       '/dns4/node2.delegate.ipfs.io/tcp/443/https',
    //   //       '/dns4/node3.delegate.ipfs.io/tcp/443/https'
    //   //     ]
    //   //   }
    //   // }
    //   // preload: {
    //   //   addresses: [
    //   //     '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
    //   //     '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    //   //     '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
    //   //     '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
    //   //     '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
    //   //     '/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
    //   //     '/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
    //   //     '/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
    //   //     '/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN',
    //   //     '/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
    //   //     '/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx',
    //   //     '/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
    //   //     '/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
    //   //     '/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
    //   //     '/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
    //   //     '/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
    //   //     '/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    //   //     '/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3'
    //   //   ]
    //   // }
    // })
    // const { id } = await ipfsNode.id()
    // // await ipfsBrowser.key.rm('ipns')
    // console.debug(`Browser IPFS ready! Node id: ${id}`, await ipfsNode.bootstrap.list())

    // const { cid } = await ipfsNode.add('Hello DOID')
    // console.info(cid, cid.toString())

    // // const stream = ipfsNode.cat('QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A')
    // const stream = ipfsNode.cat('QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp')
    // const decoder = new TextDecoder()
    // let data = ''

    // for await (const chunk of stream) {
    //   // chunks of data are returned as a Uint8Array, convert it back to a string
    //   data += decoder.decode(chunk, { stream: true })
    // }

    // console.log(data)
    // return

    // console.log(await ipfsNode.key.list())
    // try {
    //   await ipfsNode.key.info('ipns')
    // } catch (error) {
    //   await ipfsNode.key.import('ipns', ipfsPem, 'abc')
    // }
    // const addr = '/ipfs/QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp'
    // const res = await ipfsNode.name.publish(addr, { key: 'ipns' })
    // console.log(`https://gateway.ipfs.io/ipns/${res.name}`)
  }

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
            <div class="my-2">
              <dui-button class="block w-full secondary !rounded-full h-12" block @click=${this.submit}
                >Generate</dui-button
              >
            </div>
            <div class="my-2">seed:<br />${this.seed}</div>
            <div class="my-2">ipns CID:<br />${this.ipnsCID}</div>
            <div class="my-2">ipns Value:<br />${this.ipnsValue}</div>
          </div>
        </div>
      </div>
    </div>`
  }
}
