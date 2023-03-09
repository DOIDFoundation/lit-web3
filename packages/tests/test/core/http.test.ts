import { beforeEach, describe, expect, it } from 'vitest'

import { mockApi } from '~/utils'
import http, { isRelativePath, getBaseUri, mergeSearch } from '@lit-web3/core/src/http'

describe('http', async () => {
  beforeEach(async () => {})

  it('getBaseUri', async () => {
    expect(isRelativePath('./ab')).toBeTruthy()
    expect(isRelativePath('ab')).toBeTruthy()
    expect(getBaseUri('/ab')).toEqual(location.origin)
    expect(getBaseUri('./ab')).toEqual(location.origin + '/')
  })

  it('mergeSearch', async () => {
    const req = mergeSearch('http://localhost?a=1', { a: 2 })
    expect(req).toEqual('http://localhost/?a=2')
  })

  it('get', async () => {
    let res = await http.get(`${mockApi}/empty.json`)
    expect(res).toBeDefined()
    let error = ''
    try {
      await http.get('http://localhost/bad.json')
    } catch (err: any) {
      error = err.message
    }
    expect(error).not.toBe('')
  })

  it('post', async () => {
    let error
    try {
      await http.post(`${mockApi}/empty.json`, {})
    } catch (err: any) {
      error = err.message
    }
    expect(error).include('failed')
  })
})
