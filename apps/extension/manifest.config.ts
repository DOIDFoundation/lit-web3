import { defineManifest, defineDynamicResource } from '@crxjs/vite-plugin'
import pkg from './package.json'

const { version } = pkg
const isDev = process.env.NODE_ENV !== 'production'

const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/)

export const matches = ['file://*/*', 'http://*/*', 'https://*/*']

export default defineManifest({
  manifest_version: 3,
  name: pkg.displayName || pkg.name,
  description: pkg.description,
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: {
    default_popup: 'popup.html',
    default_icon: 'public/doid.png'
  },
  options_ui: {
    page: 'index.html',
    open_in_tab: true
  },
  icons: {
    16: 'public/doid.png',
    48: 'public/doid.png',
    128: 'public/doid.png'
  },
  permissions: [
    'activeTab',
    'favicon',
    'alarms',
    'clipboardWrite',
    'notifications',
    'scripting',
    'storage',
    'unlimitedStorage',
    'webRequest',
    ...(isDev ? ['webNavigation'] : [])
  ],
  host_permissions: ['*://*/*'],
  background: {
    service_worker: 'src/ext.entries/background.ts',
    type: 'module'
  },
  content_scripts: [{ js: ['src/ext.entries/contentscript.ts'], matches, run_at: 'document_start' }],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-ancestors 'none';"
  },
  externally_connectable: {
    matches: ['https://doid.tech/*'],
    ids: ['*']
  },
  web_accessible_resources: [{ resources: ['public/inpage.js'], matches }, defineDynamicResource({ matches })],
  minimum_chrome_version: '80'
})
