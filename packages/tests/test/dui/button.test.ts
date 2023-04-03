import { beforeEach, describe, expect, it, vi } from 'vitest'

import { html, el, elInside } from '~/utils'
import '@lit-web3/dui/src/button'

describe('Button', async () => {
  beforeEach(async () => {})

  it('Click', async () => {
    await html('<dui-button>Click</dui-button>')
    const [el$, el$inside] = [el('dui-button'), elInside('dui-button')]
    expect(el$inside.nodeName).toBe('BUTTON')
    const onClick = vi.fn()
    el$.addEventListener('click', onClick)
    el$inside.click()
    expect(onClick).toHaveBeenCalled()
    expect(el$.hasAttribute('sm')).toBeFalsy()
    expect(el$.hasAttribute('target')).toBeFalsy()
    expect(el$.hasAttribute('rel')).toBeFalsy()
    expect(el$.hasAttribute('href')).toBeFalsy()
  })
  it('Click when disabled', async () => {
    await html('<dui-button disabled>Click</dui-button>')
    const onClick = vi.fn()
    el('dui-button').addEventListener('click', onClick)
    elInside('dui-button').click()
    expect(onClick).not.toHaveBeenCalled()
  })
  it('Click when pending', async () => {
    await html('<dui-button pending>Click</dui-button>')
    const onClick = vi.fn()
    el('dui-button').addEventListener('click', onClick)
    elInside('dui-button').click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('Anchor mode', async () => {
    await html('<dui-button sm href="">Click</dui-button>')
    const [el$, el$inside] = [el('dui-button'), elInside('dui-button')]
    expect(el$.hasAttribute('sm')).toBeTruthy()
    expect(el$inside.nodeName).toBe('A')
    expect(el$inside.hasAttribute('target')).toBeTruthy()
    expect(el$inside.hasAttribute('rel')).toBeTruthy()
    expect(el$inside.hasAttribute('href')).toBeTruthy()
  })
})
