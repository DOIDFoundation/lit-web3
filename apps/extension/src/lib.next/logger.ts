// Logger for easy recognition
import { ExtContext } from '~/lib.next/constants'

export const logger = (channel: ExtContext) => {
  return (...args: any) => console.info(`[${channel}]`, ...args)
}

export const contentLogger = logger(ExtContext.content)
export const inpageLogger = logger(ExtContext.inpage)
export const backgroundLogger = logger(ExtContext.background)
export const uiLogger = logger(ExtContext.popup)
