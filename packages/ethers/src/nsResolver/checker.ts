// import { formatsByName, formatsByCoinType } from '../address-encoder'

// const data = formatsByName['BTC'].decoder('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
// console.log(data.toString('hex'))
// const addr = formatsByCoinType[0].encoder(data)
// console.log(addr)

import { isAddress } from '@ethersproject/address'
import { formatsByName } from '../address-encoder'
import uts from './uts'
export { bareTLD, wrapTLD } from './uts'
export { formatsByName, formatsByCoinType } from '../address-encoder'

// ETH, BSC
export const getRecords = () =>
  Object.fromEntries(
    ['ETH', 'BSC'].map((type: string) => {
      const { coinType, name } = formatsByName[type]
      return [coinType, { name, coinType, address: '' }]
    })
  )

export const isName = (name = '') => !uts(name).error

export const check = (keyword: string) => {
  const _isAddress = isAddress(keyword)
  const res = { name: '', address: '', error: false }
  if (_isAddress) res.address = keyword
  else {
    if (isName(keyword)) res.name = keyword
    else res.error = true
  }
  return res
}
