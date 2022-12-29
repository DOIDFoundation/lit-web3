// @ts-nocheck
import { server } from './mocks/server'
import crossFetch from 'cross-fetch'

beforeAll(() => {
  // Must be replaced by crossFetch here, this is ridiculous
  if (globalThis.fetch !== crossFetch) globalThis.fetch = crossFetch
  server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
