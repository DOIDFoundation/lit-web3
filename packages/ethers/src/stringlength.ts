import { toUtf8Bytes } from 'ethers'

// stringlength(❤‍🔥a) => > 2
export const stringlength = (str: string) => [...new Intl.Segmenter().segment(str)].length

// unicodelength(❤‍🔥a) > 7
export const unicodelength = (name: string) => {
  const utf8Name = toUtf8Bytes(name)
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
