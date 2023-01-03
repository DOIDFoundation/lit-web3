import { isAddress } from '@ethersproject/address'
import getAddressEncoder from '../address-encoder'
import uts from './uts'
import safeDecodeURIComponent from 'safe-decode-uri-component'

export const bareTLD = (name = '') => name.replace(/\.[^.]+$/, '')
export const wrapTLD = (name = '') => bareTLD(name) + '.doid'

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

export const checkDOIDName = async (
  val: string | undefined,
  { allowAddress = false, len = 2, wrap = false } = <CheckNameOptions>{}
): Promise<CheckedName> => {
  val = bareTLD(val)
  if (!val) return { error: true }
  val = bareTLD(safeDecodeURIComponent(val))
  if (allowAddress && isAddress(val)) return { address: val, val }
  // Check UTS
  const { error, domain, length } = await uts(val)
  // Check length
  if (length < len) return { error: true, msg: `Minimum ${len} characters required` }
  const name = wrap ? wrapTLD(domain) : domain
  if (error) return { error: true, msg: allowAddress ? 'Invalid name or address' : 'Invalid DOID name' }
  return { name, val: name, length }
}
