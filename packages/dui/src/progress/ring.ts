import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  Ref,
  styleMap,
  ref,
  createRef,
  classMap
} from '../shared/TailwindElement'
// Components

import style from './ring.css?inline'
@customElement('dui-progress-ring')
export class DuiProgressRing extends TailwindElement(style) {
  el$: Ref<HTMLElement> = createRef()

  @property({ type: Number }) percent = 0
  @property({ type: Number }) randomTo = 0
  @property({ type: Number }) precision = 2
  @property({ type: Boolean }) label = false
  @property({ type: Boolean }) state = false
  @property({ type: Number }) stroke = 2

  @state() randomProgress = this.randomTo
  @state() width: number = 32 // You rarely need to change this due to 100%

  get progress() {
    return Math.min(this.percent, 100)
  }
  get per() {
    let per = this.randomTo ? Math.max(this.progress, this.randomProgress) : this.progress
    return per.toFixed(this.precision)
  }
  get stat() {
    if (this.progress === 100) return 'active done'
    if (this.progress) return 'active'
    return ''
  }
  // SVG
  get radius() {
    return this.width / 2
  }
  get r() {
    return this.radius - this.stroke / 2
  }
  get ring() {
    const diam = 2 * Math.PI * this.r
    return {
      'stroke-dasharray': `${diam} ${diam}`,
      'stroke-dashoffset': `${diam - (this.progress / 100) * diam}`
    }
  }
  get r2() {
    return this.radius - this.radius / 2
  }
  get pie() {
    const diam = 2 * Math.PI * this.r2
    return {
      'stroke-dasharray': `${diam} ${diam}`,
      'stroke-dashoffset': `${diam - (this.progress / 100) * diam}`
    }
  }

  fit() {
    if (this.el$.value) this.width = this.el$.value.clientWidth
  }

  connectedCallback() {
    super.connectedCallback()
    this.fit()
  }

  render() {
    return html`<svg ${ref(this.el$)} viewBox=${`0 0 ${this.width} ${this.width}`}>
        <g stroke-width=${this.radius}>
          <circle class="p" cx=${this.radius} cy=${this.radius} r=${this.r2} style=${styleMap(this.pie)} />
        </g>
        <g stroke-width=${this.stroke}>
          <circle class="b" cx=${this.radius} cy=${this.radius} r=${this.r} />
          <circle class="f" cx=${this.radius} cy=${this.radius} r=${this.r} style=${styleMap(this.ring)} />
        </g>
      </svg>
      <div class="text ${classMap(this.$c([this.stat]))}"><slot></slot></div>`
  }
}
