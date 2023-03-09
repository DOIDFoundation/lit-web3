// @ts-expect-error
import util from 'utilShim'
if (!('util' in globalThis)) Object.defineProperty(globalThis, 'util', { value: util })
// @ts-expect-error
export * from 'utilShim'
export default util
