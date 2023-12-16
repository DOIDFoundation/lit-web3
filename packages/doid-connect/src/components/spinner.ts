import SlSpinner from '@shoelace-style/shoelace/dist/components/spinner/spinner.component.js'
import { customElement } from 'lit/decorators.js'

import { unsafeCSS, CSSResultGroup } from 'lit'
import style from './spinner.css?inline'

@customElement('doid-spinner')
export default class DOIDSpinner extends SlSpinner {
  static styles: CSSResultGroup = [SlSpinner.styles, unsafeCSS(style)]
}
