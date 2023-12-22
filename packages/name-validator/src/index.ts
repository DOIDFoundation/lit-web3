import tr46 from 'tr46'

/** Measure doid length. ASCII is measured by 1, all other unicode chars are measured 2. */
export function doidLength(name: string): number {
  const utf8Name = new TextEncoder().encode(name)
  let [len, i] = [0, 0]
  for (let bytelen = utf8Name.length; i < bytelen; len++) {
    let b = utf8Name[i]
    if (b < 0x80) {
      i += 1
    } else {
      len++
      if (b < 0xe0) {
        i += 2
      } else if (b < 0xf0) {
        i += 3
      } else if (b < 0xf8) {
        i += 4
      } else if (b < 0xfc) {
        i += 5
      } else {
        i += 6
      }
    }
  }
  return len
}

export type DOIDResult = {
  /** domain converted */
  domain: string
  error: boolean
  /** length in doid */
  length: number
}

/**
 * Convert a name to a string of Unicode symbols validated according to [STD3 Rules](http://unicode.org/reports/tr46/#STD3_Rules).
 * @returns {DOIDResult} convert result.
 */
export function toUnicode(name = ''): DOIDResult {
  const uts: any = tr46.toUnicode(name, { useSTD3ASCIIRules: true })
  // replace dot
  if (/\./.test(uts.domain)) uts.domain = uts.domain.replaceAll(/\./g, '')
  // disable 1 length char
  uts.length = doidLength(uts.domain)
  if (uts.length < 2) uts.error = true
  return uts
}
