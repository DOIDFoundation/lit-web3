/// <reference types="@types/chrome" />
declare interface Window {
  skipWaiting: any
  DOID: Record<string, any>
}
declare global {
  const browser: any
}
declare interface globalThis {
  browser: any
}
