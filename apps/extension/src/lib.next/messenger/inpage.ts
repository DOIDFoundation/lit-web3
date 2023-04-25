import { Messenger } from './base'
import * as Window from 'webext-bridge/window'
import { NAMESPACE } from '~/lib.next/constants'

// Allow window messages (deps: in contentscripts, `allowWindowMessaging(NAMESPACE)`)
Window.setNamespace(NAMESPACE)

// inpage <-> background
class InpageMessenger extends Messenger implements MESSENGER {
  constructor() {
    super('inpage', 'background', Window)
  }
}

export const inpageMessenger = new InpageMessenger()

export default inpageMessenger
