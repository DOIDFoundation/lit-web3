// import { HDKey } from 'ethereum-cryptography/hdkey'
import * as IPFS from 'ipfs-core'
import * as w3name from 'w3name'
import { Web3Storage } from 'web3.storage'
import http from '@lit-web3/core/src/http'
import { HDNodeWallet, toBeArray } from 'ethers'

import { keys } from '@libp2p/crypto'

import type { Name } from 'w3name'
class IPFSHelper {
  private ipfs: any

  constructor() {
    // Create an IPFS instance
    // this may need extra parameters
    this.ipfs = IPFS.create()
  }

  // Get the json data of the ipns name

  async readJsonData({ key = '', cid = '' } = {}) {
    const _ipfs = await this.ipfs
    // Resolve the IPNS name(pbK) to a CID
    const _cid = cid ?? (await _ipfs.name.resolve(key)).cid
    if (_cid === undefined) {
      return new Promise<object>((resolve, reject) => {
        return resolve({})
      })
    }
    return await this._readIPFS(cid)
  }

  // Update ipfs data and update relative ipns
  /*   async updateJsonData(json: Object, doidName: string, { memo = '' }: any = {}): Promise<Record<string, any>> {
    // get private by doidName from storage
    const _memo = memo || this._getMnemonicByDoidName(doidName)
    // write json to ipfs
    const cid = await this._writeIPFS(JSON.stringify(json))
    // get publickey from private
    await this._writeIPNS(cid, _memo)
    // bytes
    const bytes = (await this._getIPNSNameFromStorage(memo)).bytes
    return { cid, bytes }
  }
 */
  async _chkIPNSExist(name: Name) {
    let exist = false
    let revision: any
    try {
      revision = await w3name.resolve(name)
      exist = true
    } catch (e) {
      exist = false
    }
    return exist ? revision : false
  }

  async _writeIPNS(cid: string, mnemonic: string) {
    const name = await this._getIPNSNameFromStorage(mnemonic)
    let res = await this._chkIPNSExist(name)

    const revision = res ? res : await w3name.v0(name, cid)
    try {
      const nextRevision = await w3name.increment(revision!, cid)
      await w3name.publish(
        new w3name.Revision(
          nextRevision.name,
          nextRevision.value,
          nextRevision.sequence,
          new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString() // 10 years
        ),
        name.key
      )
    } catch {}
  }

  async _writeIPFS(content: string): Promise<string> {
    const files = [new File([content], 'doid.json')]
    const token = import.meta.env.VITE_WEB3STORAGE_TOKEN
    let storage = new Web3Storage({ token })
    const cid = await storage.put(files, { name: `testing files for ` })
    let ipfsCID = cid.toString()
    return ipfsCID
  }

  async _readIPFS(cid: string) {
    const url = `https://${cid}.ipfs.w3s.link/doid.json`
    const res = await http.get(url)
    return res
    // if (!configFile.ok) {
    //   console.error(`${cid}/doid.json not found`, configFile.status)
    //   return new Promise((resolve, reject) => resolve)
    // }
    // return await configFile.text()
  }

  // async _getPrivateKeyFromMnemoic(mnemonic: string): Promise<Uint8Array> {
  //   let seed = await mnemonicToSeed(mnemonic)
  //   let key = HDKey.fromMasterSeed(seed)
  //   let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)
  //   return key.deriveChild(0x444f4944).privateKey
  // }

  _getMnemonicByDoidName(name: string): string {
    return 'oven busy immense pitch embrace same edge leave bubble focus denial ripple'
  }

  // get the publickey from a seedphase
  async _getIPNSNameFromStorage(phrase: string): Promise<w3name.WritableName> {
    const wallet = HDNodeWallet.fromPhrase(phrase)

    // let key = HDKey.fromMasterSeed(seed)
    // let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', key.deriveChild(0x444f4944).privateKey!)
    let ipfsKey = await keys.generateKeyPairFromSeed('Ed25519', toBeArray(wallet.deriveChild(0x444f4944).privateKey))
    return await w3name.from(ipfsKey.bytes)
  }
}

const ipfsHelper = new IPFSHelper()
export default ipfsHelper
