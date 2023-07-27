import { AptosAccount } from 'aptos'
import { Mnemonic, HDNodeWallet, randomBytes } from 'ethers'
import { Keypair as SolanaKeyPair } from '@solana/web3.js'
import { derivePath } from 'ed25519-hd-key'

export const PHRASE_LEN_MAP = [12, 15, 18, 21, 24]

export enum AddressType {
  eth = 'eth',
  aptos = 'aptos',
  solana = 'solana'
}
export type MultiChainAddresses = {
  [key in AddressType]: string
}

export const genMnemonic = () => {
  const phrase = Mnemonic.fromEntropy(randomBytes(16))
  return phrase
}
export const validatePhrase = (phrase = '') => {
  const err = Mnemonic.isValidMnemonic(phrase) ? '' : 'Bad mnemonic'
  return err
}
export const phraseMatch = async (phrase = '', target = '') => {
  if (!phrase) return false
  if (target) {
    let ethAddr = await phraseToAddress(phrase, AddressType.eth)
    return target ? target === String(ethAddr).toLowerCase() : true
  }
  return true
}

export const phraseToAddress = async (phrase: string, type?: keyof typeof AddressType) => {
  if (!phrase) throw new Error('No phrase')
  const addrs = Object.fromEntries(Object.keys(AddressType).map((key) => [key, ''])) as MultiChainAddresses

  // Wallet
  const mnemnoic = Mnemonic.fromPhrase(phrase)
  const seed = mnemnoic.computeSeed()
  const wallet = HDNodeWallet.fromMnemonic(mnemnoic)

  // ETH
  if (type == AddressType.eth || !type) {
    addrs[AddressType.eth] = wallet.address
  }

  // Aptos
  if (type == AddressType.aptos || !type) {
    const aptos = AptosAccount.fromDerivePath(`m/44'/637'/0'/0'/0'`, phrase)
    addrs[AddressType.aptos] = aptos.address().hex()
  }

  // Solana
  if (type == AddressType.solana || !type) {
    const solanaKeypair = SolanaKeyPair.fromSeed(derivePath(`m/44'/501'/0'/0'`, seed.replace(/^0x/, '')).key)
    addrs[AddressType.solana] = solanaKeypair.publicKey.toBase58()
  }

  return type ? addrs[type] : addrs
}
