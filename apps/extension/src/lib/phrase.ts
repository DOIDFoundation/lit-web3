import { mnemonicToSeed, validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { toHex } from 'ethereum-cryptography/utils'
import { HDKey } from 'ethereum-cryptography/hdkey'

export const PHRASE_LEN_MAP = [12, 15, 18, 21, 24]

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
