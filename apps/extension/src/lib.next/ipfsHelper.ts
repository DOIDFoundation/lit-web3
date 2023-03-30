import IPFS from 'ipfs-core'
import Wallet from 'ethereumjs-wallet'
import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { toHex } from 'ethereum-cryptography/utils'
import { HDKey } from 'ethereum-cryptography/hdkey'
import { keys } from '@libp2p/crypto'
import * as w3name from 'w3name'

class IPFSHelper {
  private ipfs: any

  constructor() {
    // Create an IPFS instance
    // this may need extra parameters
    this.ipfs = IPFS.create()
  }

  // async mnemonicToIPNSCid(mnemonic: string, password: string): Promise<string> {
  //   // Create an Ethereum wallet instance from the mnemonic seed

  //   const privateKey = new Buffer('')
  //   const wallet = new Wallet(privateKey)
  //   return wallet.getPublicKeyString()
  // }

  // Get the json data of the ipns name
  async readJsonData(name: string): Promise<object> {
    // Resolve the IPNS name to a CID
    const { cid } = await this.ipfs.name.resolve(name)

    // Use the IPFS instance to retrieve the JSON data as a Buffer
    const data = await this.ipfs.cat(cid)

    // Convert the Buffer to a string and parse it as JSON
    const json = JSON.parse(data.toString())

    // Return the parsed JSON object
    return json
  }

  // Update ipfs data and update relative ipns
  async updateJsonData(json: object, doidName: string): Promise<string> {
    // get private by doidName from storage
    const seed = this._getMnemonicByDoidName(doidName)
    const publickey = await this._getPublicKeyFromStorage(seed)

    // write json to ipfs
    const cid = await this._writeIPFS(json)

    // get publickey from private
    await this._writeIPNS(cid, publickey)

    return cid
  }

  async _writeIPNS(cid: string, name: string) {
    await this.ipfs.name.publish(cid, { key: name })
  }

  async _writeIPFS(json: object): Promise<string> {
    // Convert the JSON object to a Buffer
    const buffer = Buffer.from(JSON.stringify(json))

    // Add the Buffer to IPFS and get the CID
    const { cid } = await this.ipfs.add(buffer)

    // Return the CID as a string
    return cid.toString()
  }

  async _readIPFS(cid: string): Promise<object> {
    // Use the IPFS instance to retrieve the JSON data as a Buffer
    const data = await this.ipfs.cat(cid)

    // Convert the Buffer to a string and parse it as JSON
    const json = JSON.parse(data.toString())

    // Return the parsed JSON object
    return json
  }

  _getMnemonicByDoidName(name: string): string {
    // TODO
    // how to get unlock mnemonic from storage
    return ''
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
