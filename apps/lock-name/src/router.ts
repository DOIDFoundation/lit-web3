import { html } from 'lit'
import { keyed } from 'lit/directives/keyed.js'

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
    path: '/search/:keyword',
    render: ({ keyword = '' }) => html`<view-search .keyword=${keyword}></view-search>`,
    enter: async () => {
      await import('@/views/search')
      return true
    }
  },
  {
    name: 'name',
    path: '/name/:name?/:action?',
    render: ({ name = '', action = '' }) =>
      html`${keyed(name, html`<view-name .name=${name} .action=${action}></view-name>`)}`,
    enter: async () => {
      await import('@/views/name')
      return true
    }
  },
  {
    name: 'address',
    path: '/address/:address?/:action?',
    render: ({ address = '', action = '' }) =>
      html`${keyed(address, html`<view-address .address=${address} .action=${action}></view-address>`)}`,
    enter: async () => {
      await import('@/views/address')
      return true
    }
  }
]

export default routes
