import { beforeEach, describe, expect, it, vi } from 'vitest'

import { phraseToAddress } from '@lit-web3/extension/src/lib.next/keyring/phrase'

describe('Phrase', async () => {
  beforeEach(async () => {})

  it('getAddress', async () => {
    const phrase = 'swarm rocket eternal muscle minor hamster attitude address nurse praise entry pact'

    const ethAddress = await phraseToAddress(phrase, 'ethereum')
    console.log(ethAddress)
    expect(ethAddress).equal('0xf14fb3c8ab193b2aba966fe360534f43c43ff710')

    const aptosAddress = await phraseToAddress(phrase, 'aptos')
    console.log(aptosAddress)
    expect(aptosAddress).equal('0xc887bf4d06c41cb70346026c525a6c803efafd50953ed2d3ef6836ad3f116645')

    const solanaAddress = await phraseToAddress(phrase, 'solana')
    console.log(solanaAddress)
    expect(solanaAddress).equal('2cZewAL2mbJ92ndDgLXiszPnN1fyoFowK2PyX9fHbAuR')
  })

  it('collection name', async () => {})
})
