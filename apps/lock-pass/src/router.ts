import { html } from 'lit'

export const routes = [
  {
    name: 'lock',
    path: '/',
    render: () => html`<view-lock></view-lock>`,
    enter: async () => {
      await import('~/views/lock')
      return true
    }
  },
  {
    name: 'passes',
    path: '/passes',
    render: () => html`<view-passes></view-passes>`,
    enter: async () => {
      await import('~/views/passes')
      return true
    }
  },
  {
    name: 'help',
    path: '/help',
    render: () => html`<view-help></view-help>`,
    enter: async () => {
      await import('~/views/help')
      return true
    }
  }
]

export default routes
