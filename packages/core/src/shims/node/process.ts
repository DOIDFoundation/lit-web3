if (typeof process === 'undefined') {
  const process = { env: import.meta.env, version: import.meta.env.VITE_APP_VER }
  Object.defineProperty(globalThis, 'process', { value: process })
}
export default process
