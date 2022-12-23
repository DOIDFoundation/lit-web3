import { getResolverContract } from './controller'
import { assignOverrides, getAccount } from '../useBridge'
import { txReceipt } from '../txReceipt'
import { formatBytes32String } from '@ethersproject/strings'
import { useStorage } from '../useStorage'

export const secretKey = async (name: string) => `.${name}`
const now = () => new Date().getTime()
const getStorage = async (name: string) => await useStorage(`reg.${name}`, sessionStorage)

export const makeCommitment = async (name: string, owner?: string, secret = '', data = []): Promise<Commitment> => {
  const storage = await getStorage(name)
  const saved = await storage.get()
  if (saved) return saved
  const contract = await getResolverContract()
  if (!owner) owner = await getAccount()
  const commitment = {
    secret: await contract.makeCommitment(name, owner, formatBytes32String(secret), data),
    ts: now()
  }
  await storage.set(commitment, { merge: true })
  return commitment
}

export const commit = async (name: string) => {
  const commitment = await makeCommitment(name)
  const contract = await getResolverContract()
  const [method, overrides] = ['commit', {}]
  const parameters = [commitment.secret]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  const storage = await getStorage(name)
  const tx = new txReceipt(call, {
    errorCodes: 'Resolver',
    seq: {
      type: 'commit',
      title: 'Commit',
      ts: now(),
      overrides
    },
    onSent: () => storage.set({ ts: now() }, { merge: true })
  })
  return tx
}
