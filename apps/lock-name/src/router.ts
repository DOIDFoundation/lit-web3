import { html } from 'lit'

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
  }
]

export default routes
