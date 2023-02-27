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
  permissions: [
    'activeTab',
    'alarms',
    'clipboardWrite',
    'notifications',
    'scripting',
    'storage',
    'unlimitedStorage',
    'webRequest',
    ...(isDev ? ['webNavigation'] : [])
  ],
  host_permissions: [...matches, 'http://localhost:4813/'],
  background: {
    service_worker: 'src/ext.scripts/app-init.ts',
    type: 'module'
  },
  content_scripts: [{ js: ['src/ext.scripts/contentscript.ts'], matches, run_at: 'document_start' }],
  // web_accessible_resources: [{ resources: ['public/inpage.js'], matches }, defineDynamicResource({ matches })],
  web_accessible_resources: [defineDynamicResource({ matches })]
})
