import { html } from 'lit'

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
    name: 'collections',
    path: '/collections',
    render: () => html`<view-collections></view-collections>`,
    enter: async () => {
      await import('@/views/collection/list')
      return true
    }
  }
]

export default routes
