import uts46 from 'tr46'

export default (name = ''): any => {
  return uts46.toUnicode(name, { useSTD3ASCIIRules: true })
}
