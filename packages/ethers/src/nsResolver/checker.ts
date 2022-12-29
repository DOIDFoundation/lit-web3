// import { formatsByName, formatsByCoinType } from '../address-encoder'

// const data = formatsByName['BTC'].decoder('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
// console.log(data.toString('hex'))
// const addr = formatsByCoinType[0].encoder(data)
// console.log(addr)

import { isAddress } from '@ethersproject/address'
import getAddressEncoder from '../address-encoder'
import uts from './uts'
import { bareTLD, wrapTLD } from './uts'
export { bareTLD, wrapTLD }
import { bridgeStore } from '../useBridge'
import { unicodelength } from '../stringlength'

// ETH, BSC
export const getRecords = async () => {
  const { formatsByName } = await getAddressEncoder()
  return Object.fromEntries(
    ['ETH', 'BSC'].map((type: string) => {
      const { coinType, name } = formatsByName[type]
      return [coinType, { name, coinType, address: '' }]
    })
  )
}

export const checkDOIDName = (
  val: string | undefined,
  { allowAddress = false, requireWallet = true, len = 2, wrap = false } = <CheckNameOptions>{}
): CheckedName => {
  val = bareTLD(val)
  if (!val) return { error: true }
  val = decodeURIComponent(val)
  if (allowAddress && isAddress(val)) return { address: val, val }
  // Not connected
  if (requireWallet && bridgeStore.notReady) return { error: true, msg: `Please connect your wallet first` }
  // Check length
  const length = unicodelength(val)
  if (length < len) return { error: true, msg: `Minimum ${len} characters required` }
  // Check UTS
  const { error, domain } = uts(val)
  const name = wrap ? wrapTLD(domain) : domain
  if (error) return { error: true, msg: allowAddress ? 'Invalid name or address' : 'Invalid DOID name' }
  return { name, val: name, length }
}
