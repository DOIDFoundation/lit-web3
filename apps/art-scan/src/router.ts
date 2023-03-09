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
      await import('~/views/home')
      return true
    }
  },
  {
    name: 'artist',
    path: '/artist/:name?',
    render: ({ name = '' }) => {
      const key = getKeyFromRouter(name)
      const DOID = cached.get(key)
      return html`${keyed(key, html`<view-artist .DOID=${DOID}></view-artist>`)}`
    },
    enter: async ({ name = '' }) => {
      const [DOID, key] = await parseDOIDFromRouter(name)
      if (DOID.equal) {
        cached.set(key, DOID)
      } else if (DOID.uri) {
        emitter.emit('router-replace', `/artist/${DOID.uri}`)
        return false
      }
      if (DOID.error && name) {
        emitter.emit('router-replace', '/')
        return false
      }
      await import('~/views/artist')
      return true
    }
  },
  {
    name: 'collection',
    path: '/collection/:name/:tokenName?',
    render: ({ name = '', tokenName = '' }) => {
      const key = getKeyFromRouter(name, tokenName)
      const DOID = cached.get(key)
      return html`${keyed(key, html`<view-collection .DOID=${DOID}></view-collection>`)}`
    },
    enter: async ({ name = '', tokenName = '' }) => {
      if (name && !tokenName) {
        emitter.emit('router-replace', `/artist/${name}`)
        return false
      }
      const [DOID, key] = await parseDOIDFromRouter(name, tokenName)
      if (DOID.equal) {
        cached.set(key, DOID)
      } else if (DOID.uri) {
        emitter.emit('router-replace', `/collection/${DOID.uri}`)
        return false
      }
      if (DOID.error && tokenName) {
        emitter.emit('router-replace', '/')
        return false
      }
      await import('~/views/collection')
      return true
    }
  }
]

export default routes
