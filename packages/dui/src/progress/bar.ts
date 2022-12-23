import { TailwindElement, html, customElement, property, state, when, styleMap } from '../shared/TailwindElement'
// Components

import style from './bar.css?inline'
@customElement('progress-bar')
export class ProgressBar extends TailwindElement(style) {
  @property({ type: Number }) percent = 0
  @property({ type: Number }) randomTo = 0
  @property({ type: Number }) precision = 2
  @property({ type: Boolean }) label = false
  @property({ type: Boolean }) state = false

  @state() pending = false
  @state() randomProgress = this.randomTo
  @state() randomTimer: any = null

  get progress() {
    return Math.min(this.percent, 100)
  }
  get per() {
    let per = this.randomTo ? Math.max(this.progress, this.randomProgress) : this.progress
    return per.toFixed(this.precision)
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('randomTo')) {
      if (this.randomTo) {
        this.randomProgress = this.percent
        this.randomTimer = setInterval(() => {
          this.randomProgress += Math.floor(Math.random() * (0.5 - 0.1 + 1) + 0.1)
          if (this.randomProgress >= this.randomTo) clearInterval(this.randomTimer)
        }, 200)
      } else {
        clearInterval(this.randomTimer)
      }
    }
    return true
  }

  render() {
    return html`<div class="relative flex grow w-full items-center">
      <div class="bar bg-gray-300 relative block w-full h-1.5 overflow-hidden rounded-full">
        <p
          class="per pr-1 absolute top-0 h-full rounded-full transition-all bg-green-600"
          style=${styleMap({ width: `${this.per}%` })}
        ></p>
      </div>
    </div>`
  }
}