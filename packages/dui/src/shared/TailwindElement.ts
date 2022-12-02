import { LitElement, unsafeCSS, CSSResult } from 'lit'

import TailwindBase from './tailwind.global.css'

export declare class TAILWINDELEMENT extends LitElement {
  static styles: any
  static disabled: boolean
  emit: Function
  on: any
  $: Function
  $$: Function
}

export const TailwindElement = (styles: unknown | unknown[]): PublicConstructor<TAILWINDELEMENT> =>
  class extends LitElement implements TAILWINDELEMENT {
    constructor() {
      super()
      // Trick for external link, todo: use import svg instead
      this.attachShadow({ mode: 'open' }).innerHTML = import.meta.env.VITE_APP_MDI
    }
    static styles = (Array.isArray(styles) ? styles.flat() : [TailwindBase, styles]).map((r) =>
      r instanceof CSSResult ? r : unsafeCSS(r)
    )
    // Query
    $(selector: string) {
      return this.shadowRoot?.querySelector(selector)
    }
    $$(selector: string) {
      return this.shadowRoot?.querySelectorAll(selector)
    }
    // Element Events
    emit<T>(type: string, detail: T, options = []) {
      this.dispatchEvent(new CustomEvent(type, { detail, bubbles: false, ...options }))
    }
    on(type: string, listener: EventListener, options?: any) {
      this.addEventListener(type, listener, options)
    }
  }

// For some convenience
export { html, css } from 'lit'
// Decorators
export * from 'lit/decorators.js'
// Directives
export * from 'lit/directives/choose.js'
export * from 'lit/directives/class-map.js'
export * from 'lit/directives/guard.js'
export * from 'lit/directives/if-defined.js'
export * from 'lit/directives/keyed.js'
export * from 'lit/directives/map.js'
export * from 'lit/directives/ref.js'
export * from 'lit/directives/repeat.js'
export * from 'lit/directives/style-map.js'
export * from 'lit/directives/unsafe-html.js'
export * from 'lit/directives/until.js'
export * from 'lit/directives/when.js'
