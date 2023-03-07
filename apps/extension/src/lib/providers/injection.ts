// ref: @metamask-extention/shared/modules/provider-injection.js
enum InjectType {
  'contentscript',
  'init'
}
type InjectTypes = keyof typeof InjectType
const injectType: InjectTypes = 'contentscript'

export default function shouldInjectProvider(type?: string) {
  if (type && type !== injectType) return false
  return doctypeCheck() && suffixCheck() && documentElementCheck() && !blockedDomainCheck()
}
function doctypeCheck() {
  const { doctype } = window.document
  if (doctype) {
    return doctype.name === 'html'
  }
  return true
}
function suffixCheck() {
  const prohibitedTypes = [/\.xml$/u, /\.pdf$/u]
  const currentUrl = window.location.pathname
  for (let i = 0; i < prohibitedTypes.length; i++) {
    if (prohibitedTypes[i].test(currentUrl)) {
      return false
    }
  }
  return true
}
function documentElementCheck() {
  const documentElement = document.documentElement.nodeName
  if (documentElement) {
    return documentElement.toLowerCase() === 'html'
  }
  return true
}
function blockedDomainCheck() {
  return false
}
