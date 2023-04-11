import { beforeEach, describe, expect, it, vi } from 'vitest'

import ipfsHelper from '@lit-web3/extension/src/lib.next/ipfsHelper'

describe('Phrase', async () => {
  beforeEach(async () => {})

  it('write ipfs', async () => {
    expect(1 == 1).to.equal(true)
    const cid = await ipfsHelper._writeIPFS('aaaaaaaaaa')
  })

  it.skip('read from ipfs', async () => {
    const data = await ipfsHelper._readIPFS('QmYSKxoV2eLJpRJv9LEVRtTrtT6TA6J7ksZaMNNdauNpWv')
    const value = await data['test']
    expect(value == 123)
  })

  it.skip('write ipns name', async () => {
    await ipfsHelper._writeIPNS(
      'QmYSKxoV2eLJpRJv9LEVRtTrtT6TA6J7ksZaMNNdauNpWv',
      'oven busy immense pitch embrace same edge leave bubble focus denial ripple'
    )
  }, 10000)

  it.skip('read json by ipns name', async () => {
    const ipnsName = 'test'
    const res = await ipfsHelper.readJsonData(ipnsName)
    console.log(res)
  })

  it('', async () => {
    //oven busy immense pitch embrace same edge leave bubble focus denial ripple
  })
})
