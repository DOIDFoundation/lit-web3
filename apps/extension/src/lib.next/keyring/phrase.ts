import { AptosAccount } from 'aptos'
import { Mnemonic, HDNodeWallet, randomBytes } from 'ethers'
import { Keypair as SolanaKeyPair } from '~/services/Solana/solana-web3'
import { derivePath } from 'ed25519-hd-key'

export const PHRASE_LEN_MAP = [12, 15, 18, 21, 24]
export const supportedChain: ChainName[] = ['ethereum', 'aptos', 'solana']

export type MultiChainAddresses = {
  [chainName in ChainName]: string
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
    let ethAddr = await phraseToAddress(phrase, 'ethereum')
    return target ? target === String(ethAddr).toLowerCase() : true
  }
  return true
}

export const phraseToAddress = async (phrase: string, chainName?: ChainName) => {
  if (!phrase) throw new Error('No phrase')
  const addrs = Object.fromEntries(supportedChain.map((key) => [key, ''])) as MultiChainAddresses

  // Wallet
  const mnemnoic = Mnemonic.fromPhrase(phrase)
  const seed = mnemnoic.computeSeed()
  const wallet = HDNodeWallet.fromMnemonic(mnemnoic)

  // ETH
  if (chainName === 'ethereum' || !chainName) {
    addrs['ethereum'] = wallet.address
  }

  // Aptos
  if (chainName === 'aptos' || !chainName) {
    const aptos = AptosAccount.fromDerivePath(`m/44'/637'/0'/0'/0'`, phrase)
    addrs['aptos'] = aptos.address().hex()
  }

  // Solana
  if (chainName === 'solana' || !chainName) {
    const solanaKeypair = SolanaKeyPair.fromSeed(derivePath(`m/44'/501'/0'/0'`, seed.replace(/^0x/, '')).key)
    addrs['solana'] = solanaKeypair.publicKey.toBase58()
  }

  return chainName ? addrs[chainName] : addrs
}
