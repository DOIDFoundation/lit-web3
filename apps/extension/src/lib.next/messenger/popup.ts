import { Messenger } from './base'
import * as Popup from 'webext-bridge/popup'

// popup <-> background
export const popupMessenger = new Messenger('popup', 'background', Popup)

export default popupMessenger
