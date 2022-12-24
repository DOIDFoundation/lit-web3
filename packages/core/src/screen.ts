import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'
import emitter from './emitter'

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export const match = (v: number) => window.matchMedia(`(max-width: ${v}px)`).matches

type Screen = {
  isMobi: boolean
  md: boolean
  ratio: number
  ts: number
}
export const screen: Screen = {
  isMobi: match(breakpoints.lg),
  md: match(breakpoints.md),
  ratio: window.devicePixelRatio ?? 2,
  ts: 1
}

class ScreenStore extends State {
  @property({ value: screen, type: Object }) screen!: Screen
  constructor() {
    super()
    const ro = new ResizeObserver(() => {
      this.screen.ts++
      console.log('ji', match(breakpoints.lg))
      this.screen.isMobi = match(breakpoints.lg)
      this.screen.md = match(breakpoints.md)
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

window.addEventListener('resize', () => (screen.ratio = window.devicePixelRatio), { passive: true })

export default screen
