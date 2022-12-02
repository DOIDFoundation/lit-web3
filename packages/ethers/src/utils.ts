import { BigNumber } from '@ethersproject/bignumber'

export const ZERO = '0x0000000000000000000000000000000000000000'
export const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

// gasLimit add 50%
export const gasLimit = (gasEstimate: BigNumber, multiplyPercent = Number(import.meta.env.VITE_APP_GASLIMIT) || 50) =>
  gasEstimate.mul(BigNumber.from(10000).add(BigNumber.from(multiplyPercent * 100))).div(BigNumber.from(10000))

export const shortAddress = (address: string, { leftLen = 6, rightLen = 4 } = {}) => {
  if (!address) return
  const len = address.length
  return `${address.substring(0, leftLen)}...${address.substring(len - rightLen, len)}`
}
export const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export const nowTs = () => new Date().getTime()

// limit: 0 as debounce
export const throttle = (fn: Function, delay = 100, limit = 300, immediate = false) => {
  let [timer, checkTime] = [<any>null, 0]
  const later = (...args: any) => {
    fn(...args)
    checkTime = 0
    immediate = false
  }
  return (...args: any) => {
    clearTimeout(timer)
    const now = new Date().getTime()
    if (!immediate && !checkTime) checkTime = now
    if (limit && now - checkTime >= limit) later(...args)
    else timer = setTimeout(() => later(...args), delay)
  }
}
export const debounce = (fn: Function, delay = 300) => throttle(fn, delay, 0)
