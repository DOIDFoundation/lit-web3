import { ThemeElement, customElement } from '../shared/theme-element'
import { PlayPauseAbleElement } from './audioish'

@customElement('dui-video')
export class DuiVideo extends PlayPauseAbleElement(ThemeElement('')) {}
