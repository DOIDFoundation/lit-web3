import { html } from 'lit'
import { keyed } from 'lit/directives/keyed.js'
import { checkDOIDName, wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { isAddress } from '@ethersproject/address'
import emitter from '@lit-web3/core/src/emitter'

export const routes = [
  {
    name: 'home',
    path: '/',
    render: () => html`<view-home></view-home>`,
    enter: async () => {
      await import('@/views/home')
      return true
    }
  },
  {
    name: 'search',
    path: '/search/:keyword?',
    render: ({ keyword = '' }) => html`<view-search .keyword=${decodeURIComponent(keyword)}></view-search>`,
    enter: async ({ keyword = '' }) => {
      const decoded = decodeURIComponent(keyword)
      const { error, val } = checkDOIDName(decoded, { allowAddress: true, wrap: true })
      if (val && val !== decoded) {
        emitter.emit('router-goto', `/search/${val}`)
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('@/views/search')
      return true
    }
  },
  {
    name: 'name',
    path: '/name/:name?/:action?',
    render: ({ name = '', action = '' }) =>
      html`${keyed(name, html`<view-name .name=${decodeURIComponent(name)} .action=${action}></view-name>`)}`,
    enter: async ({ name = '' }) => {
      const decoded = decodeURIComponent(name)
      const { error, val } = checkDOIDName(decoded, { wrap: true })
      if (val && val !== wrapTLD(decoded)) {
        emitter.emit('router-goto', `/name/${wrapTLD(val)}`)
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('@/views/name')
      return true
    }
  },
  {
    name: 'address',
    path: '/address/:address?/:action?',
    render: ({ address = '', action = '' }) =>
      html`${keyed(
        address,
        html`<view-address .address=${decodeURIComponent(address)} .action=${action}></view-address>`
      )}`,
    enter: async ({ address = '' }) => {
      if (address && !isAddress(address)) {
        emitter.emit('router-goto', '/address')
        return false
      }
      await import('@/views/address')
      return true
    }
  },
  {
    name: 'favorites',
    path: '/favorites',
    render: () => html`<view-favorites></view-favorites>`,
    enter: async () => {
      await import('@/views/favorites')
      return true
    }
  },
  {
    name: 'faq',
    path: '/faq',
    render: () => html`<view-faq></view-faq>`,
    enter: async () => {
      await import('@/views/faq')
      return true
    }
  }
]

export default routes
