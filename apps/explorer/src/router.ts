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
    render: ({ m = '' }) => html`<view-home .miner=${m}></view-home>`,
    enter: async () => {
      await import('~/views/home')
      return true
    }
  },
  {
    name: 'block',
    path: '/block/:height?',
    render: ({ height = '' }) => html`<view-block .height=${height}></view-block>`,
    enter: async () => {
      await import('~/views/block')
      return true
    }
  },
  {
    name: 'blocks',
    path: '/blocks/:m?',
    render: ({ m = '' }) => html`<view-home .miner=${m}></view-home>`,
    enter: async () => {
      await import('~/views/home')
      return true
    }
  },
  {
    name: 'txhash',
    path: '/tx/:height?',
    render: ({ height = '' }) => html`<view-block .height=${height}></view-block>`,
    enter: async () => {
      await import('~/views/block')
      return true
    }
  },
]

export default routes
