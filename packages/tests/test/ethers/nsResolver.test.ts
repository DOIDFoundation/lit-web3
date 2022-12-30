import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'
import { ZERO } from '@lit-web3/ethers/src/utils'

describe('checkDOIDName', async () => {
  beforeEach(async () => {})

  it('checkDOIDName', async () => {
    var { error, name } = await checkDOIDName('banana')
    expect(error).toBeFalsy()
    expect(name).to.equal('banana')
    var { val } = await checkDOIDName('banana', { wrap: true })
    expect(val).to.equal('banana.doid')
    var { address } = await checkDOIDName('0x123', { allowAddress: true })
    expect(address).not.toBeDefined()
    var { address } = await checkDOIDName(ZERO, { allowAddress: true })
    expect(address).toBeDefined()
    var { address } = await checkDOIDName(ZERO)
    expect(address).not.toBeDefined()
    // Emoji
    var { length, name } = await checkDOIDName('❤%E2%80%8D🔥')
    expect(length).to.equal(6)
    var { length, name } = await checkDOIDName('❤%EF%B8%8F%E2%80%8D🔥')
    expect(length).to.equal(6)
    var { length, name } = await checkDOIDName('❤️‍🔥')
    expect(length).to.equal(6)
  })
})
