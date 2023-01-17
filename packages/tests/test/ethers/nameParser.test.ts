import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DOIDParser } from '@lit-web3/ethers/src/DOIDParser'

describe('DOIDParser', async () => {
  beforeEach(async () => {})

  it('Just DOID name', async () => {
    const req = 'banana.doid/'
    const parser = await DOIDParser(req)
    expect(parser.parsed.name).to.equal('banana')
    expect(parser.parsed.token?.name).to.equal('')
  })

  it('collection name', async () => {
    const req = 'banana.doid/crypto-name#1-2'
    const parser = await DOIDParser(req)
    expect(parser.parsed.name).to.equal('banana')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('2')
    // collection name
    expect(parser.stringify()).to.equal(req)
  })

  it('collection name with unicode', async () => {
    const parser = await DOIDParser(`banana.doid/你好-世/界 %%2E的#`)
    expect(parser.parsed.token?.name).to.equal('你好-世/界 %.的#')
  })

  it('with multi slash', async () => {
    const parser = await DOIDParser('banana.doid/crypto-name/eth#1-2')
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

  it('token with slugID', async () => {
    const parser = await DOIDParser('banana.doid/crypto-name#1')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('1')
    expect(parser.parsed.uri).to.equal('banana.doid/crypto-name#1')
  })

  it('token with slugID & tokenID', async () => {
    const parser = await DOIDParser('banana.doid/crypto-name#1-2')
    expect(parser.parsed.token?.slugID).to.equal('1')
    expect(parser.parsed.token?.tokenID).to.equal('2')
    expect(parser.parsed.uri).to.equal('banana.doid/crypto-name#1-2')
  })

  it('invalid hash', async () => {
    const parser = await DOIDParser('banana.doid/crypto-name##')
    expect(parser.parsed.token?.tokenID).to.equal('')
  })

  it('slugName', async () => {
    const parser = await DOIDParser('vincent.doid/The Starry Night/abc')
    expect(parser.parsed.token?.slugName).to.equal('the-starry-night-abc')
  })

  it(`name's suffix contain number from string 1`, async () => {
    const parser = await DOIDParser('lucy.doid/Cyberpunk 2077')
    expect(parser.parsed.token?.tokenID).to.equal('')
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077')
  })

  it(`name's suffix contain number from string 2`, async () => {
    const parser = await DOIDParser('lucy.doid/Cyberpunk 2077#1-2')
    expect(parser.parsed.token?.tokenID).to.equal('2')
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#1-2')
  })

  it(`name's suffix contain number from string 3`, async () => {
    const parser = await DOIDParser('lucy.doid/Cyberpunk 2077#2077-2077')
    expect(parser.parsed.token?.tokenID).to.equal('2077')
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#2077')
  })

  it(`name's suffix contain number from string 4`, async () => {
    const parser = await DOIDParser('lucy.doid/Cyberpunk 2077#2077-2')
    expect(parser.parsed.token?.tokenID).to.equal('2')
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#2077-2')
  })

  it(`name's suffix contain number from string 5`, async () => {
    const parser = await DOIDParser('lucy.doid/Cyberpunk#2077#2077-')
    expect(parser.parsed.token?.tokenID).to.equal('2077')
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#2077')
  })

  it(`name's suffix contain number from coll 1`, async () => {
    const parser = await DOIDParser({ name: 'lucy.doid', token: { name: 'Cyberpunk 2077', tokenID: '3', slugID: '2' } })
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#2-3')
  })

  it(`name's suffix contain number from coll 2`, async () => {
    const parser = await DOIDParser({ name: 'lucy.doid', token: { name: 'Cyberpunk 2077', tokenID: '3', slugID: '3' } })
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#3')
  })

  it(`name's suffix contain number from coll 3`, async () => {
    const parser = await DOIDParser({ name: 'lucy.doid', token: { name: 'Cyberpunk 2077', tokenID: '3' } })
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk#2077-3')
  })

  it(`name's suffix contain number from coll 4`, async () => {
    const parser = await DOIDParser({ name: 'lucy.doid', token: { name: 'Cyberpunk 2077', tokenID: '2077' } })
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk#2077')
  })

  it(`name's suffix contain number from coll 5`, async () => {
    const parser = await DOIDParser({ name: 'lucy.doid', token: { name: 'Cyberpunk #2077', tokenID: '2077' } })
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk#2077')
  })

  it(`name's suffix contain number from coll 6`, async () => {
    const parser = await DOIDParser({ name: 'lucy.doid', token: { name: 'Cyberpunk #2077', slugID: '2077' } })
    expect(parser.parsed.token?.tokenID).to.equal('2077')
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#2077')
  })

  it(`name's suffix contain number from coll 6`, async () => {
    const parser = await DOIDParser({ name: 'lucy.doid', token: { name: 'Cyberpunk 2077 #2077', tokenID: '2077' } })
    expect(parser.parsed.token?.tokenID).to.equal('2077')
    expect(parser.parsed.uri).to.equal('lucy.doid/cyberpunk-2077#2077')
  })

  it(`name from coll`, async () => {
    const parser = await DOIDParser({ name: 'vincent', token: { name: 'The Starry Night', tokenID: '3' } })
    expect(parser.parsed.uri).to.equal('vincent.doid/the-starry-night#3')
  })

  it('encode tokenName for uri', async () => {
    const parser = await DOIDParser('vincent/The Starry Night/abc')
    expect(parser.parsed.uri).to.equal('vincent.doid/the-starry-night-abc')
    expect(parser.parsed.val).to.equal('vincent.doid/the-starry-night-abc') // This will be deprecated soon
  })
})
