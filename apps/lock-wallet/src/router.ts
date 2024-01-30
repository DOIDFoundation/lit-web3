import { html } from 'lit'
import { safeDecodeURIComponent } from '@doid/core/uri'
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
    name: 'send',
    path: '/send/:token?',
    render: ({ token = '' }) => html`<view-send .token=${safeDecodeURIComponent(token)}></view-send>`,
    enter: async () => {
      await import('~/views/send')
      return true
    }
  },
  {
    name: 'receive',
    path: '/receive',
    render: () => html`<view-receive></view-receive>`,
    enter: async () => {
      await import('~/views/receive')
      return true
    }
  },
]


export default routes
