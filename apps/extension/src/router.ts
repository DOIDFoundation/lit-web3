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
    path: '/unlock/:path?',
    render: ({ path = '' }) => {
      return html`<view-unlock .ROUTE=${{ path }}></view-unlock>`
    },
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
  },
  {
    name: 'main',
    path: '/main',
    render: () => html`<view-main></view-main>`,
    enter: async () => {
      await import('~/views/main')
      return true
    }
  },
  {
    name: 'start',
    path: '/start',
    render: () => html`<view-start></view-start>`,
    enter: async () => {
      await import('~/views/start')
      return true
    }
  },
  {
    name: 'import2nd',
    path: '/import2nd',
    render: () => html`<import-2nd></import-2nd>`,
    enter: async () => {
      await import('~/views/import2nd')
      return true
    }
  },
  {
    name: 'import3rd',
    path: '/import3rd',
    render: () => html`<import-3rd></import-3rd>`,
    enter: async () => {
      await import('~/views/import3rd')
      return true
    }
  },
  {
    name: 'import4th',
    path: '/import4th',
    render: () => html`<import-4th></import-4th>`,
    enter: async () => {
      await import('~/views/import4th')
      return true
    }
  },
  {
    name: 'generatePhrase',
    path: '/generate-phrase/:step?',
    render: ({ step = '' }) => {
      return html`<view-phrase .ROUTE=${{ step }}></view-phrase>`
    },
    enter: async () => {
      await import('~/views/generate-phrase')
      return true
    }
  }
]

export default routes
