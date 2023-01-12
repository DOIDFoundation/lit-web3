import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DOIDParser } from '@lit-web3/ethers/src/DOIDParser'

describe('DOIDParser', async () => {
  beforeEach(async () => {})

  it('Just DOID name', async () => {
    var req = 'banana.doid/'
    var parser = await DOIDParser(req)
    expect(parser.parsed.name).to.equal('banana')
    expect(parser.parsed.token?.name).to.equal('')
  })

  it('collection name', async () => {
    var req = 'banana.doid/crypto-name#1-2'
    var parser = await DOIDParser(req)
    expect(parser.parsed.name).to.equal('banana')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('2')
    // collection name
    expect(parser.stringify()).to.equal(req)
    var parser = await DOIDParser(`banana.doid/你好-世/界 %%2E的#`)
    expect(parser.parsed.token?.name).to.equal('你好-世/界 %.的#')
  })

  it('with multi slash', async () => {
    var parser = await DOIDParser('banana.doid/crypto-name/eth#1-2')
    expect(parser.parsed.token?.name).to.equal('crypto-name/eth')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('2')
    expect(parser.parsed.uri).to.equal('banana.doid/crypto-name-eth#1-2')
  })

  it('with multi hash', async () => {
    var parser = await DOIDParser('banana.doid/crypto-name/eth#abc#1-')
    expect(parser.parsed.token?.name).to.equal('crypto-name/eth#abc')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('1')
    var parser = await DOIDParser('banana.doid/crypto-name/eth#abc###')
    expect(parser.parsed.token?.name).to.equal('crypto-name/eth#abc###')
  })

  it('token', async () => {
    var parser = await DOIDParser('banana.doid/crypto-name#1')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('1')
    expect(parser.parsed.uri).to.equal('banana.doid/crypto-name#1')
    var parser = await DOIDParser('banana.doid/crypto-name#1-2')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('2')
    expect(parser.parsed.uri).to.equal('banana.doid/crypto-name#1-2')
    var parser = await DOIDParser('banana.doid/crypto-name##')
    expect(parser.parsed.token?.tokenID).to.equal('')
  })

  it('slugName', async () => {
    var parser = await DOIDParser('vincent.doid/The Starry Night/abc')
    expect(parser.parsed.token?.slugName).to.equal('the-starry-night-abc')
  })

  it('encode tokenName for uri', async () => {
    var parser = await DOIDParser('vincent/The Starry Night/abc')
    expect(parser.parsed.uri).to.equal('vincent.doid/the-starry-night-abc')
    expect(parser.parsed.val).to.equal('vincent.doid/the-starry-night-abc')
  })
})
