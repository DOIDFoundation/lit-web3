//
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export const match = (v: number) => window.matchMedia(`(max-width: ${v}px)`).matches

export const screen = {
  isMobi: match(breakpoints.lg),
  ratio: window.devicePixelRatio ?? 2
}
window.addEventListener('resize', () => (screen.ratio = window.devicePixelRatio), { passive: true })

export default screen
