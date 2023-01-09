// @ts-nocheck
import { server } from './mocks/server'
import crossFetch from 'cross-fetch'

beforeAll(() => {
  // Must be replaced by crossFetch here, this is ridiculous
  if (globalThis.fetch !== crossFetch) globalThis.fetch = crossFetch
  server.listen({ onUnhandledRequest: 'bypass' })
})
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
// Browser API Mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
})
