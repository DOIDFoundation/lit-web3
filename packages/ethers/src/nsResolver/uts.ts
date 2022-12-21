import uts46 from 'tr46'
import { unicodelength } from '../stringlength'

export default (name = ''): any => {
  const uts: any = uts46.toUnicode(name, { useSTD3ASCIIRules: true })
  if (/\./.test(uts.domain)) uts.error = true // disable dot
  else if (unicodelength(uts.domain) < 2) uts.error = true // disable 1 length char
  return uts
}
