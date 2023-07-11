import { keccak256, toUtf8Bytes, getBytes, toBeHex, formatUnits } from 'ethers'
import { getContract, assignOverrides, getChainId, getAccount } from '@lit-web3/ethers/src/useBridge'
// import { normalizeTxErr } from '@lit-web3/ethers/src/parseErr'
import { txReceipt } from '@lit-web3/ethers/src/txReceipt'
import { PassCates, PassCate } from '@lit-web3/ethers/src/constants/passcate'
import { ZERO_HASH } from '@lit-web3/ethers/src/utils'

export const LENs = [64, 130]

export const getPassCates = async () => PassCates[await getChainId()]
export const getPassCate = async () =>
  Object.fromEntries(Object.entries(await getPassCates()).map((r) => [r[1][0], r[0]]))

export const getLockerContract = async () => getContract('Locker', { account: await getAccount() })

const non0x = (code: string) => code.replace(/^0x/, '')
const getLen = (non0xCode: string) => LENs[non0xCode.length < LENs[1] ? 0 : 1]
export const getICode = (code: string) => {
  code = non0x(code)
  return `0x${code.slice(0, getLen(code))}`
}
export const getICate = (code: string) => {
  code = non0x(code)
  const len = getLen(code)
  return code.slice(len, len + 1).toUpperCase()
}

export const getICId = (code: string) => {
  code = non0x(code)
  return parseInt(code.slice(getLen(code) + 1, code.length) || '0', 16)
}
export const getPassCateLen = (code: string) => PassCate[getICate(code) ?? 'C'] ?? PassCate.C
export const getInviteCode = async (account?: string) => {
  if (!account) account = await getAccount()
  const CHash = keccak256(toUtf8Bytes('C'))
  let code = ''
  // Sig way is offline
  // const bridge = await getBridge()
  // const signer = bridge.provider.getSigner(account || bridge.account)
  // try {
  //   code = await signer.signMessage(getBytes(CHash))
  // } catch (err) {
  //   throw await normalizeTxErr(err)
  // }
  code = toBeHex(BigInt(account!) ^ BigInt(CHash))
  return [code.replace('0x', ''), 'c', '0'].join('')
}

export const checkNameExists = async (name: string) => {
  const contract = await getLockerContract()
  return await contract.nameExists(name)
}

export const alreadyHasPasses = async () => {
  const account = await getAccount()
  if (!account) return false
  const res = await getPasses(account)
  return res.length > 0
}

export const getPasses = async (account?: string, withDetail = false) => {
  if (!account) account = await getAccount()
  const contract = await getLockerContract()
  return await contract[withDetail ? 'getUserPassesInfo' : 'getUserPassList'](account)
}

export const getNameByHash = async (hash: string) => {
  let name = ''
  if (!hash || hash === ZERO_HASH) return name
  const contract = await getLockerContract()
  try {
    name = await contract.getNameByHash(getBytes(hash))
  } catch {}
  return name
}

export const getPassInfo = async (passId: string, account?: string) => {
  const contract = await getLockerContract()
  const passCate = await getPassCates()
  let info: Record<string, string | number> = { id: passId, cate: 'C', len: 6, name: '' }
  try {
    const [id, cate, hash] = await contract.getUserPassInfo(passId)
    const passcate = passCate[cate] ?? Object.values(info)
    info = { id, cate: passcate[0], hash, len: passcate[1], name: await getNameByHash(hash) }
  } catch {}
  return info
}

export const lockPass = async (codeOrPass: any, name = '') => {
  let { id, code, cate } = codeOrPass
  const isLockName = !!id
  if (!id) {
    code = getICode(codeOrPass)
    const passCate = await getPassCate()
    cate = passCate[getICate(codeOrPass)]
    id = getICId(codeOrPass)
  }
  const contract = await getLockerContract()
  const method = isLockName ? 'lockName' : 'lockPass'
  const overrides = {}
  const parameters = isLockName ? [+id, name] : [code, name, cate, +id]

  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  return new txReceipt(call, {
    errorCodes: 'Locker',
    allowAlmostSuccess: true,
    seq: {
      type: isLockName ? 'LockName' : 'lockPass',
      title: isLockName ? `Lock Name` : `Lock Pass`,
      ts: new Date().getTime(),
      overrides
    }
  })
}

export const getInviteLimits = async (account?: string) => {
  if (!account) account = await getAccount()
  const contract = await getLockerContract()
  const res = await contract.getUserInvitedNumber(account)
  return formatUnits(res[1], 0)
}
