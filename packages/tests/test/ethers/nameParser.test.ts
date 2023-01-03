import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DOIDNameParser } from '@lit-web3/ethers/src/nameParser'

describe('DOIDNameParser', async () => {
  beforeEach(async () => {})

  it('valid', async () => {
    var req = 'banana.doid/crypto-name#1-2'
    var parser = await DOIDNameParser(req)
    expect(parser.parsed.name).to.equal('banana.doid')
    // collection name
    expect(parser.stringify()).to.equal(req)
    var parser = await DOIDNameParser(`banana.doid/你好-世/界 %%2E的`)
    expect(parser.parsed.token?.name).to.equal('你好-世/界 %.的')
    // token
    var parser = await DOIDNameParser('banana.doid/crypto-name#1-2')
    expect(parser.parsed.token?.tokenID).to.equal('1')
    expect(parser.parsed.token?.sequence).to.equal('2')
    // check exists
  })

  it('invalid', async () => {
    var parser = await DOIDNameParser('banana.doid/#crypto-name#1-2')
    expect(parser.parsed.token?.name).to.equal('')
    expect(parser.parsed.token?.tokenID).to.equal('')
  })
})
