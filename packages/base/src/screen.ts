import { State, property } from './state'
export { StateController } from './state'
import emitter from './emitter'

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export const match = (v: number) => globalThis.matchMedia(`(max-width: ${v}px)`).matches

type Screen = {
  isMobi: boolean
  md: boolean
  lg: boolean
  ratio: number
  ts: number
  interacted: boolean
}
export const screen: Screen = {
  isMobi: match(breakpoints.lg),
  md: match(breakpoints.md),
  lg: match(breakpoints.lg),
  ratio: globalThis.devicePixelRatio ?? 2,
  ts: 1,
  interacted: false
}

class ScreenStore extends State {
  @property({ value: screen }) screen!: Screen
  constructor() {
    super()
    const ro = new ResizeObserver(() => {
      this.screen = Object.assign({}, this.screen, {
        ts: this.screen.ts++,
        isMobi: match(breakpoints.md),
        md: match(breakpoints.md),
        lg: match(breakpoints.lg)
      })
      emitter.emit('force-request-update')
    })
    ro.observe(document.documentElement)
  }
  get isMobi() {
    return this.screen.isMobi
  }
  get md() {
    return this.screen.md && this.screen.ts
  }
}
export const screenStore = new ScreenStore()

globalThis.addEventListener('resize', () => (screen.ratio = globalThis.devicePixelRatio), { passive: true })

export const setInteracted = () => {
  screen.interacted = true
  globalThis.removeEventListener('keydown', setInteracted)
  globalThis.removeEventListener('click', setInteracted)
}
globalThis.addEventListener('keydown', setInteracted, { once: true })
globalThis.addEventListener('click', setInteracted, { once: true })

export default screen
