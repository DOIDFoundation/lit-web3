import { getResolverContract } from './controller'
import { bareTLD } from './checker'
import { assignOverrides, getAccount } from '../useBridge'
import { txReceipt } from '../txReceipt'
import { encodeBytes32String } from 'ethers'
import { useStorage } from '../useStorage'

export const secretKey = async (name: string) => `.${name}`
export const now = () => new Date().getTime()
const getStorage = async (name: string) => await useStorage(`reg.${name}`, { store: sessionStorage })
const seed = 'secret'

export const getCommitment = async (name: string): Promise<Commitment | undefined> => {
  const storage = await getStorage(name)
  const commitment = await storage.get()
  if (commitment && (!commitment.sent || now() - commitment.ts >= 86400 * 1000)) {
    storage.remove()
    return
  }
  return commitment
}

export const clearCommitment = async (name: string) => (await getStorage(name)).remove()

export const makeCommitment = async (name: string, secret = seed, data = []): Promise<Commitment> => {
  throw new Error('deprecated')
  const storage = await getStorage(name)
  const saved = await storage.get()
  if (saved) return saved
  const contract = await getResolverContract()
  const commitment = {
    secret: await contract.makeCommitment(bareTLD(name), await getAccount(), encodeBytes32String(secret), data),
    ts: now()
  }
  await storage.set(commitment, { merge: true })
  return commitment
}

export const commit = async (name: string) => {
  throw new Error('deprecated')
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
    onSent: () => storage.set({ ts: now(), sent: true }, { merge: true }),
    onSuccess: () => storage.set({ ts: now(), success: true }, { merge: true }),
    onError: () => storage.remove()
  })
  return tx
}

export const register = async (name: string, account?: string, secret = seed, data = []) => {
  const contract = await getResolverContract()
  const [method, overrides] = ['register', {}]
  const parameters = [bareTLD(name), account || (await getAccount())]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  const tx = new txReceipt(call, {
    errorCodes: 'Resolver',
    seq: {
      type: 'register',
      title: 'Register',
      ts: now(),
      overrides
    }
  })
  return tx
}
