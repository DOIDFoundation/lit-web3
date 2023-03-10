export const process = { env: import.meta.env, version: import.meta.env.VITE_APP_VER }
if (!('process' in globalThis)) Object.defineProperty(globalThis, 'process', { value: process })
if (!('global' in globalThis)) Object.defineProperty(globalThis, 'global', { value: globalThis })
if (!('window' in globalThis)) Object.defineProperty(globalThis, 'window', { value: globalThis })

export default process
