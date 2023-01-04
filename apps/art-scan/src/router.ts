import { html } from 'lit'
import { keyed } from 'lit/directives/keyed.js'
import emitter from '@lit-web3/core/src/emitter'
import { parseDOIDFromRouter, getKeyFromRouter } from '@lit-web3/ethers/src/DOIDParser'

const cached: Map<string, unknown> = new Map()

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
      const DOID = cached.get(getKeyFromRouter(name, tokenName))
      return html`${keyed(name, html`<view-artist .DOID=${DOID}></view-artist>`)}`
    },
    enter: async ({ name = '', tokenName = '' }) => {
      if (name && tokenName) {
        emitter.emit('router-goto', `/collection/${name}/${tokenName}${location.hash}`)
        return false
      }
      const [DOID, key] = await parseDOIDFromRouter(name, tokenName)
      if (DOID.equal) {
        cached.set(key, DOID)
      } else {
        emitter.emit('router-goto', `/artist/${DOID.name}`)
        return false
      }
      if (DOID.error && (name || tokenName)) {
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
      const DOID = cached.get(getKeyFromRouter(name, tokenName))
      return html`<view-collection
        .DOID=${DOID}
        .name=${name}
        .tokenName=${tokenName}
        .keyword=${name}
        .token=${`${tokenName}${location.hash}`}
      ></view-collection>`
    },
    enter: async ({ name = '', tokenName = '' }) => {
      if (name && !tokenName) {
        emitter.emit('router-goto', `/artist/${name}`)
        return false
      }
      const [DOID, key] = await parseDOIDFromRouter(name, tokenName)
      if (DOID.equal) {
        cached.set(key, DOID)
      } else {
        emitter.emit('router-goto', `/collection/${DOID.uri}`)
        return false
      }
      if (DOID.error && (name || tokenName)) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('@/views/collection')
      return true
    }
  }
]

export default routes
