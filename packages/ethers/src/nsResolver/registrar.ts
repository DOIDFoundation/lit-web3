import { assignOverrides, txReceipt, getChainId, getAccount, getResolverContract } from './controller'
import { formatBytes32String } from '@ethersproject/strings'

export const secretKey = async (name: string) => `${await getChainId()}.${name}`
const now = () => new Date().getTime()

// Commitment cache
export const getCommitment = async (name: string) => {
  const saved = sessionStorage.getItem(await secretKey(name))
  if (saved) return JSON.parse(saved)
}
export const saveCommitment = async (name: string, data: Commitment) => {
  const saved = (await getCommitment(name)) || {}
  Object.assign(saved, data)
  sessionStorage.setItem(await secretKey(name), JSON.stringify(saved))
}

export const makeCommitment = async (name: string, owner?: string, secret = '', data = []): Promise<Commitment> => {
  const saved = await getCommitment(name)
  if (saved) return saved
  const contract = await getResolverContract()
  if (!owner) owner = await getAccount()
  const commitment = {
    secret: await contract.makeCommitment(name, owner, formatBytes32String(secret), data),
    ts: now()
  }
  await saveCommitment(name, commitment)
  return commitment
}

export const commit = async (name: string) => {
  const commitment = await makeCommitment(name)
  const contract = await getResolverContract()
  const [method, overrides] = ['commit', {}]
  const parameters = [commitment.secret]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  const tx = new txReceipt(call, {
    errorCodes: 'Resolver',
    seq: {
      type: 'commit',
      title: 'Commit',
      ts: now(),
      overrides
    },
    onSent: () => saveCommitment(name, { ts: now() })
  })
  return tx
}
