// Extension context
export enum ExtContext {
  content = 'content',
  inpage = 'inpage',
  background = 'background',
  popup = 'popup',
  devtools = 'devtools',
  options = 'options'
}

// Message context (https://github.com/zikaari/webext-bridge/tree/next#destination)
export enum MessageContext {
  content = 'content-script',
  inpage = 'window',
  background = 'background',
  popup = 'popup',
  devtools = 'devtools',
  options = 'options'
}
export const INPAGE = MessageContext.inpage
export const CONTENT = MessageContext.content
export const BACKGROUND = MessageContext.background
export const POPUP = MessageContext.popup
export const OPTIONS = MessageContext.options
export const DEVTOOLS = MessageContext.devtools
export const NAMESPACE = 'github.com.DOIDFoundation.lit-web3.doid.tech'
