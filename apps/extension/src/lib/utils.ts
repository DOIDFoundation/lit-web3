import {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_FULLSCREEN,
  ENVIRONMENT_TYPE_BACKGROUND,
  PLATFORM_FIREFOX,
  PLATFORM_OPERA,
  PLATFORM_CHROME,
  PLATFORM_EDGE,
  PLATFORM_BRAVE
} from '../../../shared/constants/app'

export const chkPwdValid = (pwd: string, { min = 8, max = 30 } = {}) => {
  const len = pwd.length
  if (len < min) return { error: true, msg: `Minimum ${min} characters required` }
  return { pwd }
}

interface DeferredPromise {
  promise: Promise<any>
  resolve?: () => void
  reject?: () => void
}
export function deferredPromise(): DeferredPromise {
  let resolve: DeferredPromise['resolve']
  let reject: DeferredPromise['reject']
  const promise = new Promise<void>((innerResolve: () => void, innerReject: () => void) => {
    resolve = innerResolve
    reject = innerReject
  })
  return { promise, resolve, reject }
}

export const getPlatform = () => {
  const { navigator } = window
  const { userAgent } = navigator

  if (userAgent.includes('Firefox')) {
    return PLATFORM_FIREFOX
  } else if ('brave' in navigator) {
    return PLATFORM_BRAVE
  } else if (userAgent.includes('Edg/')) {
    return PLATFORM_EDGE
  } else if (userAgent.includes('OPR')) {
    return PLATFORM_OPERA
  }
  return PLATFORM_CHROME
}
