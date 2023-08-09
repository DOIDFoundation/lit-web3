import { html } from 'lit'
import { keyed } from 'lit/directives/keyed.js'

// import emitter from '@lit-web3/core/src/emitter'
import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'
import emitter from '@lit-web3/core/src/emitter'
import popupMessenger from '~/lib.next/messenger/popup'
import { isUnlock, isInit, keyringState } from '~/lib.next/popup'

popupMessenger.on('keyring_update', () => {})
popupMessenger.on('connect_change', () => {})
popupMessenger.on('state_lock', () => emitter.emit('router-goto', '/unlock'))
popupMessenger.on('popup_goto', ({ data: r }) => r && emitter.emit('router-goto', r))
popupMessenger.on('popup_replace', ({ data: r }) => r && emitter.emit('router-replace', r))

// const beforeEachRedirected = async (): Promise<boolean> => {
//   const { isInitialized, isUnlocked } = await keyringState()
//   if (!isInitialized && !location.href.includes('/landing')) {
//     // debugger
//     // emitter.emit('router-goto', '/start')
//     emitter.emit('router-goto', '/')
//     return true
//   }
//   if (!isUnlocked) {
//     emitter.emit('router-goto', '/unlock')
//     return true
//   }
//   return false
// }

const homeView = {
  name: 'home',
  path: '/',
  render: () => html`<view-home></view-home>`,
  enter: async () => {
    if (!(await isInit())) {
      await import('~/views/home')
      return true
    }
    if (!(await isUnlock())) {
      emitter.emit('router-goto', '/unlock')
      return false
    }

    emitter.emit('router-goto', '/main')
    return false
  }
}

export const routes = [
  homeView,
  // Alias of home view
  { ...homeView, path: '/popup' },
  {
    name: 'unlock',
    path: '/unlock/:dest?',
    render: ({ dest = '/main' }) => html`<view-unlock .dest=${safeDecodeURIComponent(dest)}></view-unlock>`,
    enter: async () => {
      await import('~/views/unlock')
      return true
    }
  },
  {
    ...homeView,
    path: '/create',
    enter: async () => {
      await import('~/views/home')
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
    name: 'import',
    path: '/import',
    render: () => html`<view-import></view-import>`,
    enter: async () => {
      await import('~/views/import')
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
  // {
  //   name: 'import3rd',
  //   path: '/import3rd',
  //   render: () => html`<import-3rd></import-3rd>`,
  //   enter: async () => {
  //     await import('~/views/import3rd')
  //     return true
  //   }
  // },
  // {
  //   name: 'import4th',
  //   path: '/import4th',
  //   render: () => html`<import-4th></import-4th>`,
  //   enter: async () => {
  //     await import('~/views/import4th')
  //     return true
  //   }
  // },
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
    path: '/landing/:name?',
    render: ({ name = '' }) => html`<view-landing .name=${safeDecodeURIComponent(name)}></view-landing>`,
    enter: async () => {
      await import('~/views/dapps/landing')
      return true
    }
  },
  {
    name: 'connect',
    path: '/connect/:host?/:chain?',
    render: ({ host = '', chain = '' }) => {
      return html`<view-connect .host=${safeDecodeURIComponent(host)} .chain=${chain}></view-connect>`
    },
    enter: async () => {
      // if (await isConnected()) {
      //   return false
      // }
      await import('~/views/connect')
      return true
    }
  },
  {
    name: 'notification',
    path: '/notification/:msg?/:host?',
    render: ({ msg = '', host = '' }) => {
      const key = [msg, host].join('-')
      return html`${keyed(key, html`<view-notification .ROUTE=${{ msg, host }}></view-notification>`)}`
    },
    enter: async () => {
      await import('~/views/notification')
      return true
    }
  },
  {
    name: 'settings',
    path: '/settings',
    render: () => {
      return html`<view-settings></view-settings>`
    },
    enter: async () => {
      await import('~/views/settings')
      return true
    }
  },
  {
    name: 'idle',
    path: '/idle',
    render: () => {
      return html``
    }
  }
]

export default routes
