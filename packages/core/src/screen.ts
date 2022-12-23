import { State, property } from '@lit-app/state'

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
}
export const screen: Screen = {
  isMobi: match(breakpoints.lg),
  md: match(breakpoints.md),
  ratio: window.devicePixelRatio ?? 2
}

class ScreenStore extends State {
  @property({ value: screen, type: Object }) screen!: Screen
  get isMobi() {
    return match(breakpoints.lg)
  }
  get md() {
    return match(breakpoints.md)
  }
}
export const screenStore = new ScreenStore()

window.addEventListener('resize', () => (screen.ratio = window.devicePixelRatio), { passive: true })

export default screen
