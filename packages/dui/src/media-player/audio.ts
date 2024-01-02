import { ThemeElement, customElement } from '../shared/theme-element'
import { PlayPauseAbleElement } from './audioish'

@customElement('dui-audio')
export class DuiAudeo extends PlayPauseAbleElement(ThemeElement(''), { tag: 'audio' }) {}
