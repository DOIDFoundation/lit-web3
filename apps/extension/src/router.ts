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
    name: 'ipfs',
    path: '/ipfs',
    render: () => html`<view-ipfs></view-ipfs>`,
    enter: async () => {
      await import('~/views/ipfs')
      return true
    }
  },
  {
    name: 'unlock',
    path: '/unlock',
    render: () => html`<view-unlock></view-unlock>`,
    enter: async () => {
      await import('~/views/unlock')
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
  },
  {
    name: 'keyring',
    path: '/keyring',
    render: () => html`<view-keyring></view-keyring>`,
    enter: async () => {
      await import('~/views/keyring')
      return true
    }
  }
]

export default routes
