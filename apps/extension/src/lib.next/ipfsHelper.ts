import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { HDKey } from 'ethereum-cryptography/hdkey'
// import { toHex } from 'ethereum-cryptography/utils'
// import Wallet from 'ethereumjs-wallet'
import * as IPFS from 'ipfs-core'
import * as w3name from 'w3name'
import { Web3Storage } from 'web3.storage'

import { keys } from '@libp2p/crypto'

class IPFSHelper {
  private ipfs: any

  constructor() {
    // Create an IPFS instance
    // this may need extra parameters
    this.ipfs = IPFS.create()
  }

  // Get the json data of the ipns name
  async readJsonData(name: string): Promise<object> {
    // Resolve the IPNS name to a CID
    const _ipfs = await this.ipfs
    const { cid } = await _ipfs.name.resolve(name)
    if (cid === undefined) {
      return new Promise<object>((resolve, reject) => {
        return resolve({})
      })
    }

    return JSON.parse(await this._readIPFS(cid))
  }

  // Update ipfs data and update relative ipns
  async updateJsonData(json: Object, doidName: string, { memo = '' }: any = {}): Promise<string> {
    // get private by doidName from storage
    const _memo = memo || this._getMnemonicByDoidName(doidName)

    // write json to ipfs
    const cid = await this._writeIPFS(JSON.stringify(json))

    // get publickey from private
    await this._writeIPNS(cid, _memo)

    return cid
  }

  async _writeIPNS(cid: string, mnemonic: string) {
    console.log('mnemonic', mnemonic)
    let seed = await mnemonicToSeed(mnemonic)
    let key = HDKey.fromMasterSeed(seed)
    let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)
    const name = await w3name.from(ipfsKey.bytes)
    const revision = await w3name.resolve(name)
    const nextRevision = await w3name.increment(revision, cid)
    await w3name.publish(
      new w3name.Revision(
        nextRevision.name,
        nextRevision.value,
        nextRevision.sequence,
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString() // 10 years
      ),
      name.key
    )
  }

  async _writeIPFS(content: string): Promise<string> {
    const files = [new File([content], 'doid.txt')]
    let storage = new Web3Storage({ token: process.env.VITE_WEB3STORAGE_TOKEN })
    const cid = await storage.put(files, { name: `testing files for ` })
    let ipfsCID = cid.toString()
    console.log('stored files with cid:', ipfsCID)
    return ipfsCID
  }

  async _readIPFS(cid: string): Promise<string> {
    let configFile = await fetch(`https://${cid}/ipfs.w3s.link/doid.json`)
    if (!configFile.ok) {
      console.error(`${cid}/doid.json not found`, configFile.status)
      return new Promise((resolve, reject) => resolve)
    }
    return await configFile.text()
  }

  // async _getPrivateKeyFromMnemoic(mnemonic: string): Promise<Uint8Array> {
  //   let seed = await mnemonicToSeed(mnemonic)
  //   let key = HDKey.fromMasterSeed(seed)
  //   let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)
  //   return key.deriveChild(0x444f4944).privateKey
  // }

  _getMnemonicByDoidName(name: string): string {
    let local_storage = { zzzxxx: 'oven busy immense pitch embrace same edge leave bubble focus denial ripple' }

    return 'oven busy immense pitch embrace same edge leave bubble focus denial ripple'
  }

  // get the publickey from a seedphase
  async _getPublicKeyFromStorage(mnemonic: string): Promise<string> {
    let seed = await mnemonicToSeed(mnemonic)
    let key = HDKey.fromMasterSeed(seed)
    let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)
    const name = await w3name.from(ipfsKey.bytes)
    return name.toString()
  }
}

const ipfsHelper = new IPFSHelper()
export default ipfsHelper
