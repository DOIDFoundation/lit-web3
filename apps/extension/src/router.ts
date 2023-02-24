import { html } from 'lit'
import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'

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
  {
    name: 'create',
    path: '/create/:doid?',
    render: ({ doid = '' }) => html`<view-create .doid=${safeDecodeURIComponent(doid)}></view-create>`,
    enter: async () => {
      await import('~/views/create')
      return true
    }
  },
  {
    name: 'restore',
    path: '/restore/:doid?',
    render: ({ doid = '' }) => html`<view-restore .name=${safeDecodeURIComponent(doid)}></view-restore>`,
    enter: async () => {
      await import('~/views/restore')
      return true
    }
  }
]

export default routes
