import { html } from 'lit'

const homeView = {
  name: 'home',
  path: '/',
  render: () => html`<view-home></view-home>`,
  enter: async () => {
    await import('~/views/home')
    return true
  }
}

export const routes = [
  homeView,
  // Alias of home view
  { ...homeView, path: '/popup' },
  {
    name: 'unlock',
    path: '/unlock',
    render: () => html`<view-unlock></view-unlock>`,
    enter: async () => {
      await import('~/views/unlock')
      return true
    }
  },
  // dApp Sample
  {
    name: 'dApp',
    path: '/dApp',
    render: () => html`<view-dapp></view-dapp>`,
    enter: async () => {
      await import('~/views/dApp.sample')
      return true
    }
  },
  {
    name: 'restore',
    path: '/restore',
    render: () => html`<view-restore></view-restore>`,
    enter: async () => {
      await import('~/views/restore')
      return true
    }
  }
]

export default routes
