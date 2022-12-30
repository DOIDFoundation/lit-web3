import { unicodelength } from '../stringlength'

let promise: any
export const uts46 = async () => {
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    resolve(await import('tr46'))
  }))
}

export default async (name = '') => {
  const uts: any = (await uts46()).toUnicode(name, { useSTD3ASCIIRules: true })
  // replace dot
  if (/\./.test(uts.domain)) uts.domain = uts.domain.replaceAll(/\./g, '')
  // disable 1 length char
  uts.length = unicodelength(uts.domain)
  if (uts.length < 2) uts.error = true
  return uts
}
