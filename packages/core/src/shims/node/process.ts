if (typeof process === 'undefined') {
  const process = { env: import.meta.env, version: import.meta.env.VITE_APP_VER }
  Object.defineProperty(globalThis, 'process', { value: process })
}
if (typeof global === 'undefined') Object.defineProperty(globalThis, 'global', { value: globalThis })

export default process
