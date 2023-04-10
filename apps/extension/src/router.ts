import { html } from 'lit'

// import emitter from '@lit-web3/core/src/emitter'
import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'
import emitter from '@lit-web3/core/src/emitter'
import popupMessenger from '~/lib.next/messenger/popup'

popupMessenger.on('state_lock', () => emitter.emit('router-goto', '/unlock'))
const redirected = async (): Promise<boolean> => {
  const _isUnlock = await popupMessenger.send('state_isunlock')
  if (!_isUnlock) {
    emitter.emit('router-goto', '/unlock')
    return true
  }
  // const _account = await popupMessenger.send('state_account')
  return false
}

popupMessenger.send('state_isunlock')

const homeView = {
  name: 'home',
  path: '/',
  render: () => html`<view-home></view-home>`,
  enter: async () => {
    if (await redirected()) return false
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
    render: () => {
      return html`<view-unlock></view-unlock>`
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
    path: '/restore/:doid',
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
    path: '/start/:doid?',
    render: ({ doid = '' }) => html`<view-start .name=${safeDecodeURIComponent(doid)}></view-start>`,
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
  },
  {
    name: 'seed',
    path: '/seed',
    render: () => {
      return html`<view-seed></view-seed>`
    },
    enter: async () => {
      await import('~/views/seed')
      return true
    }
  },
  {
    name: 'recover',
    path: '/recover',
    render: () => {
      return html`<view-recover></view-recover>`
    },
    enter: async () => {
      await import('~/views/recover')
      return true
    }
  },
  {
    name: 'dAppLanding',
    path: '/landing',
    render: () => {
      return html`<view-landing></view-landing>`
    },
    enter: async () => {
      await import('~/views/dapps/landing')
      return true
    }
  }
]

export default routes
