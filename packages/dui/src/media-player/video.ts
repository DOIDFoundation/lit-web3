import { TailwindElement, customElement } from '../shared/TailwindElement'
import { PlayPauseAbleElement } from './audioish'

@customElement('dui-video')
export class DuiVideo extends PlayPauseAbleElement(TailwindElement('')) {}
