import { TailwindElement, customElement } from '../shared/TailwindElement'
import { PlayPauseAbleElement } from './audioish'

@customElement('dui-audio')
export class DuiAudeo extends PlayPauseAbleElement(TailwindElement(''), { tag: 'audio' }) {}
