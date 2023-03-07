import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { toHex } from 'ethereum-cryptography/utils'
import { HDKey } from 'ethereum-cryptography/hdkey'

import { arrToBufArr, bufferToHex, privateToPublic, publicToAddress } from 'ethereumjs-util'

import { AptosAccount } from 'aptos'
import { Keypair } from '@solana/web3.js'

export const PHRASE_LEN_MAP = [12, 15, 18, 21, 24]

export const enum AddressType {
  eth = 'eth',
  aptos = 'aptos',
  solana = 'solana'
}

export const validatePhrase = (phrase = '') => {
  return validateMnemonic(phrase, wordlist)
}

export const getKey = async (phrase: string) => {
  const _seed = await mnemonicToSeed(phrase)
  const seed = toHex(_seed)
  const key = HDKey.fromMasterSeed(_seed)
  const pbK = toHex(key.derive(`m/44'/60'/0'/0`).publicKey!)
  return { seed, pbK }
}

export const getAddress = async (mnemnoic: string, type: AddressType) => {
  if (type == AddressType.eth) {
  }
}
