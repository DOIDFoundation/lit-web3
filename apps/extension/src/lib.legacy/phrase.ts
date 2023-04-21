import { AptosAccount } from 'aptos'
import { mnemonicToSeed, validateMnemonic, generateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { HDKey } from 'ethereum-cryptography/hdkey'
import { toHex } from 'ethereum-cryptography/utils'
import { arrToBufArr, bufferToHex, privateToPublic, publicToAddress } from 'ethereumjs-util'

import { Keypair } from '@solana/web3.js'

export const PHRASE_LEN_MAP = [12, 15, 18, 21, 24]

export const enum AddressType {
  eth = 'eth',
  aptos = 'aptos',
  solana = 'solana'
}

export const genMnemonic = () => {
  const phrase = generateMnemonic(wordlist, 128)
  return phrase
}
export const validatePhrase = (phrase = '') => {
  const valid = validateMnemonic(phrase, wordlist)
  const err = valid ? '' : 'Bad mnemonic'
  return err
}
export const phraseMatch = async (phrase = '', target = '') => {
  if (!phrase) return false
  if (target) {
    let ethAddr = await getAddress(phrase, AddressType.eth)
    return target ? target === ethAddr : true
  }
  return true
}
export const getKey = async (phrase: string) => {
  const _seed = await mnemonicToSeed(phrase)
  const seed = toHex(_seed)
  const key = HDKey.fromMasterSeed(_seed)
  const pbK = toHex(key.derive(`m/44'/60'/0'/0`).publicKey!)
  return { seed, pbK }
}

export const getAddress = async (mnemnoic: string, type?: AddressType) => {
  let addrs = { eth: '', solana: '', aptos: '' }
  if (type == AddressType.eth || !type) {
    let seed = await mnemonicToSeed(mnemnoic)
    let key = HDKey.fromMasterSeed(seed)
    let pubKey = key.derive(`m/44'/60'/0'/0/0`).publicKey

    addrs[AddressType.eth] = bufferToHex(publicToAddress(Buffer.from(pubKey), true)).toLowerCase()
  }
  if (type == AddressType.aptos || !type) {
    let apt = AptosAccount.fromDerivePath(`m/44'/637'/0'/0'/0'`, mnemnoic)
    addrs[AddressType.aptos] = apt.address().hex()
  }
  if (type == AddressType.solana || !type) {
    let seed = await mnemonicToSeed(mnemnoic)
    let keypair = Keypair.fromSeed(seed.slice(0, 32))
    addrs[AddressType.solana] = keypair.publicKey.toBase58()
  }
  let all = null
  if (!type) all = Object.fromEntries(Object.keys(AddressType).map((key) => [key, addrs[AddressType[key]]]))

  return type ? addrs[type] : all
}
