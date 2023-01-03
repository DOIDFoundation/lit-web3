import { html } from 'lit'
import { checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'
import emitter from '@lit-web3/core/src/emitter'

export const routes = [
  {
    name: 'lock',
    path: '/',
    render: () => html`<view-home></view-home>`,
    enter: async () => {
      await import('@/views/home')
      return true
    }
  },
  {
    name: 'artist',
    path: '/artist/:name',
    render: ({ name = '' }) => {
      return html`<view-artist .name=${name}></view-artist>`
    },
    enter: async ({ name = '' }) => {
      const { error, val } = checkDOIDName(name, { wrap: true, allowAddress: false })
      if (val && val !== name) {
        emitter.emit('router-goto', '/artist/${val}')
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('@/views/artist/index')
      return true
    }
  },
  {
    name: 'collection',
    path: '/collection/:keyword/:assetName?',
    render: ({ keyword = '', assetName = '' }) => {
      const hash = `${assetName}${location.hash}`
      return html`<view-collection .keyword=${keyword} .token=${hash}></view-collection>`
    },
    enter: async ({ keyword = '', assetName = '' }) => {
      // TODO: assetName check
      const { error, val } = await checkDOIDName(keyword, { wrap: true, allowAddress: false })
      if (val && val !== keyword) {
        emitter.emit('router-goto', `/collection/${val}`)
        return false
      }
      if (error) {
        emitter.emit('router-goto', '/')
        return false
      }
      await import('@/views/collection/index')
      return true
    }
  }
]

export default routes
