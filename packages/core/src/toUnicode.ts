export default function toUnicode(str = '') {
  return str
    .split('')
    .map(function (value) {
      var temp = value.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()
      if (temp.length > 2) {
        return '\\u' + temp
      }
      return value
    })
    .join('')
}
