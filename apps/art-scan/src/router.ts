import { html } from 'lit'
import { keyed } from 'lit/directives/keyed.js'
import emitter from '@lit-web3/core/src/emitter'
import { parseDOIDURI } from '@lit-web3/ethers/src/nameParser'

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
    name: 'artist',
    path: '/artist/:name?/:tokenName?',
    render: ({ name = '', tokenName = '' }) => {
      return html`${keyed(name, html`<view-artist .name=${name} .tokenName=${tokenName}></view-artist>`)}`
    },
    enter: async ({ name = '', tokenName = '' }) => {
      const { error, val, consistent } = await parseDOIDURI(name, tokenName)
      if (!consistent) {
        emitter.emit('router-goto', `/artist/${val}`)
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('@/views/artist')
      return true
    }
  },
  {
    name: 'collection',
    path: '/collection/:name?/:tokenName?',
    render: ({ name = '', tokenName = '' }) => {
      return html`<view-collection
        .name=${name}
        .tokenName=${tokenName}
        .keyword=${name}
        .token=${`${tokenName}${location.hash}`}
      ></view-collection>`
    },
    enter: async ({ name = '', tokenName = '' }) => {
      const { error, val, consistent } = await parseDOIDURI(name, tokenName)
      if (!consistent) {
        emitter.emit('router-goto', `/collection/${val}`)
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('@/views/collection')
      return true
    }
  }
]

export default routes
