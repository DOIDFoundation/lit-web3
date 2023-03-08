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
} from '~/constants/app'

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

const getEnvironmentTypeMemo = (url: string) => {
  const parsedUrl = new URL(url)
  if (parsedUrl.pathname === '/popup.html') {
    return ENVIRONMENT_TYPE_POPUP
  } else if (parsedUrl.pathname.includes('generate')) {
    return ENVIRONMENT_TYPE_FULLSCREEN
  } else if (parsedUrl.pathname === '/notification.html') {
    return ENVIRONMENT_TYPE_NOTIFICATION
  }
  return ENVIRONMENT_TYPE_BACKGROUND
}
export const getEnvironmentType = (url = window.location.href) => getEnvironmentTypeMemo(url)
export const isPrefixedFormattedHexString = (value: unknown) =>
  typeof value === 'string' && /^0x[1-9a-f]+[0-9a-f]*$/iu.test(value)
export const isSafeChainId = (chainId: number) =>
  Number.isSafeInteger(chainId) && chainId > 0 && chainId <= 4503599627370476
