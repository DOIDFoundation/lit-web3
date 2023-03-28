import { expect } from 'chai'
import { mnemonicToSeed, publicToAddress, bufferToHex } from 'ethereumjs-util'
import HDKey from 'hdkey'
import AptosAccount from '@aptos/aptos-account'
import { Keypair } from '@solana/web3.js'

describe('getAddress', () => {
  it('should return an Ethereum address when given a mnemonic and AddressType.eth', async () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    const ethAddress = await getAddress(mnemonic, AddressType.eth)

    expect(ethAddress).to.match(/^0x[a-fA-F0-9]{40}$/)
  })

  it('should return an Aptos address when given a mnemonic and AddressType.aptos', async () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    const aptosAddress = await getAddress(mnemonic, AddressType.aptos)

    expect(aptosAddress).to.match(/^[a-fA-F0-9]{40}$/)
  })

  it('should return a Solana address when given a mnemonic and AddressType.solana', async () => {
    const mnemonic =
      'abandon abandoned abandoned abandoned abandoned abandoned abandoned abandoned abandoned abandoned about'
    const solanaAddress = await getAddress(mnemonic, AddressType.solana)

    expect(solanaAddress).to.match(/^[13][a-km-zA-HJ-NP-Z1-9]{33}$/)
  })
})
