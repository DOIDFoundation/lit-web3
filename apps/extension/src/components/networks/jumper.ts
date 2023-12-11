import {
  customElement,
  TailwindElement,
  html,
  state,
  when,
  property,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import './dialog'
import '../address'
import '../menu/drop'
import '../copy/icon'

import style from './jumper.css?inline'
@customElement('network-jumper')
export class NetworkJumper extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) dropable = false

  @state() dialog = false
  @state() menu = false

  render() {
    return html``
  }
}
