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
import { bridgeStore } from '../useBridge'
import { unicodelength } from '../stringlength'

// ETH, BSC
export const getRecords = () =>
  Object.fromEntries(
    ['ETH', 'BSC'].map((type: string) => {
      const { coinType, name } = formatsByName[type]
      return [coinType, { name, coinType, address: '' }]
    })
  )

declare type ValidateDOIDName = {
  name?: string
  address?: string
  val?: string // name or address
  error?: boolean
  msg?: string
  length?: number
}

export const checkDOIDName = (
  val: string | undefined,
  { allowAddress = false, requireWallet = true, len = 2 } = {}
): ValidateDOIDName => {
  if (!val) return { error: true }
  if (allowAddress && isAddress(val)) return { address: val, val }
  // Not connected
  if (requireWallet && bridgeStore.notReady) return { error: true, msg: `Please connect your wallet first` }
  // Check length
  const length = unicodelength(val)
  if (length < len) return { error: true, msg: `Minimum ${len} characters required` }
  // Check UTS
  const { error, domain: name } = uts(val)
  if (error) return { error: true, msg: allowAddress ? 'Invalid name or address' : 'Invalid DOID name' }
  return { name, val: name, length }
}
