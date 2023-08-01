import { html } from 'lit'
// import { keyed } from 'lit/directives/keyed.js'
// import { checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'
// import { isAddress } from 'ethers'
// import emitter from '@lit-web3/core/src/emitter'
// import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'

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
    name: 'block',
    path: '/block/:blockObj?',
    render: ({ blockObj = '' }) => html`<view-block .blockObj=${blockObj}></view-block>`,
    enter: async () => {
      await import('~/views/block')
      return true
    }
  }
]

export default routes
