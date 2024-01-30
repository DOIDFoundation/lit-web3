import { toUtf8String } from 'ethers'
import { getBridgeProvider } from './useBridge'

export const ErrorCodeMap: Record<string, string> = {
  1006: 'Disconnected',
  4001: 'User denied.',
  '-32000': 'Execution Reverted'
}

export const parseRevertReason = async (err: any): Promise<string> => {
  let { reason = '', transaction } = err
  if (reason) {
    if (!reason.includes(': ') && transaction) {
      try {
        const code = await (await getBridgeProvider()).call(transaction)
        reason = toUtf8String(code)
      } catch {}
    }
  }
  return reason
}

export const normalizeTxErr = async (raw: any, callData?: any) => {
  let { code = '', message = '' } = raw
  const errData = raw.data ?? raw.info
  const error = raw.error ?? errData?.error?.data ?? errData?.error
  if (errData?.error?.code) code = errData?.error?.code
  if (error?.code && ![-32000, 4001].includes(error.code)) code = error.code
  if (error?.message) message = error.message
  const customMsg = ErrorCodeMap[code] || ErrorCodeMap[message] || (await parseRevertReason(raw))
  if (customMsg) message = customMsg
  const err = new Error(message)
  if (!callData && errData?.payload) callData = [errData.payload.method, errData.payload.params]
  Object.assign(err, { code, raw, callData })
  return err
}
