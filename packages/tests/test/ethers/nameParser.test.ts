import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DOIDNameParser } from '@lit-web3/ethers/src/nameParser'

describe('DOIDNameParser', async () => {
  beforeEach(async () => {})

  it('DOIDNameParser', async () => {
    var req = 'banana.doid/crypto-name#1-2'
    var parser = await DOIDNameParser(req)
    expect(parser.parsed.name).to.equal('banana.doid')
    // stringify
    expect(parser.stringify()).to.equal(req)
    // unicode
    var req = `banana.doid/你好-世/界 %%2E的`
    var parser = await DOIDNameParser(req)
    expect(parser.parsed.token?.name).to.equal('你好-世/界 %.的')
    // check exists
  })
})
