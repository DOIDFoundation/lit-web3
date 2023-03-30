import { Messenger } from './base'
import * as Window from 'webext-bridge/window'
import { NAMESPACE } from '~/lib.next/constants'

// Allow window messages (deps: in contentscripts, `allowWindowMessaging(NAMESPACE)`)
Window.setNamespace(NAMESPACE)

// inpage <-> background
export const inpageMessenger = new Messenger('inpage', 'background', Window)

export default inpageMessenger
