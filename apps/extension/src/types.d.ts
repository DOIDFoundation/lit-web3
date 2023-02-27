declare global {
  const browser: typeof import('webextension-polyfill')
}
declare interface globalThis {
  browser: any
}

export {}
