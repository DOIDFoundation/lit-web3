import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

const { version } = pkg

const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/)

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
  permissions: [
    'activeTab',
    'alarms',
    'clipboardWrite',
    'notifications',
    'scripting',
    'storage',
    'unlimitedStorage',
    'webRequest'
  ],
  host_permissions: ['http://localhost:4813/', 'file://*/*', 'http://*/*', 'https://*/*'],
  background: {
    service_worker: 'src/background.ts',
    type: 'module'
  }
})
