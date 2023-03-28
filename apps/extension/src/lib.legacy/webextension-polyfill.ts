// Todo: Here always report an error currently
import Browser from 'webextension-polyfill'
if (!('browser' in globalThis)) Object.defineProperty(globalThis, 'browser', { value: Browser })

export default Browser
