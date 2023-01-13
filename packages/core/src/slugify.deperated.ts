// Only accepts Ascii characters for now

export default (input: string) => {
  // Replace special characters with space
  input = input.toLowerCase()
  var ret: string[] = []
  for (let index = 0; index < input.length; index++) {
    var charCode = input.charCodeAt(index)
    if (
      (charCode >= 32 && charCode <= 47) || //' !"#$%&'()*+,-./'
      (charCode >= 58 && charCode <= 64) || //':;<=>?@'
      charCode == 91 || //'['
      (charCode >= 93 && charCode <= 96) || //']^_`'
      charCode >= 123 //'{|}~' and unicode
    ) {
      ret.push(' ')
    } else ret.push(input.charAt(index))
  }
  input = ret.join('').trim()
  // Replace spaces with '-'
  ret = []
  var lastCharIsWhitespaceCharacters = false
  for (let index = 0; index < input.length; index++) {
    let c = input.charAt(index)
    if (c == ' ' || c == '\t' || c == '\r' || c == '\n' || c == '\v' || c == '\f') {
      if (!lastCharIsWhitespaceCharacters) ret.push('-')
      lastCharIsWhitespaceCharacters = true
    } else {
      ret.push(c)
      lastCharIsWhitespaceCharacters = false
    }
  }
  return ret.join('')
}
