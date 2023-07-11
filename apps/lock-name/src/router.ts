import { html } from 'lit'
import { keyed } from 'lit/directives/keyed.js'
import { checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'
import { isAddress } from 'ethers'
import emitter from '@lit-web3/core/src/emitter'
import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'

export const routes = [
  {
    name: 'home',
    path: '/',
    render: () => html`<view-home></view-home>`,
    enter: async () => {
      await import('~/views/home')
      return true
    }
  },
  {
    name: 'search',
    path: '/search/:keyword?',
    render: ({ keyword = '' }) => html`<view-search .keyword=${safeDecodeURIComponent(keyword)}></view-search>`,
    enter: async ({ keyword = '' }) => {
      const { error, val, equal } = await checkDOIDName(keyword, { allowAddress: true, wrap: true })
      if (val && !equal) {
        emitter.emit('router-goto', `/search/${val}`)
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('~/views/search')
      return true
    }
  },
  {
    name: 'name',
    path: '/name/:name?/:action?',
    render: ({ name = '', action = '' }) =>
      html`${keyed(name, html`<view-name .name=${safeDecodeURIComponent(name)} .action=${action}></view-name>`)}`,
    enter: async ({ name = '' }) => {
      const { error, val, equal } = await checkDOIDName(name, { wrap: true })
      if (val && !equal) {
        emitter.emit('router-goto', `/name/${val}`)
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('~/views/name')
      return true
    }
  },
  {
    name: 'address',
    path: '/address/:address?/:action?',
    render: ({ address = '', action = '' }) =>
      html`${keyed(
        address,
        html`<view-address .address=${safeDecodeURIComponent(address)} .action=${action}></view-address>`
      )}`,
    enter: async ({ address = '' }) => {
      if (address && !isAddress(address)) {
        emitter.emit('router-goto', '/address')
        return false
      }
      await import('~/views/address')
      return true
    }
  },
  {
    name: 'favorites',
    path: '/favorites',
    render: () => html`<view-favorites></view-favorites>`,
    enter: async () => {
      await import('~/views/favorites')
      return true
    }
  },
  {
    name: 'faq',
    path: '/faq',
    render: () => html`<view-faq></view-faq>`,
    enter: async () => {
      await import('~/views/faq')
      return true
    }
  },
  // dApp Sample
  {
    name: 'dApp',
    path: '/dApp',
    render: () => html`<view-dapp></view-dapp>`,
    enter: async () => {
      await import('~/views/dApp.sample')
      return true
    }
  }
]

export default routes
