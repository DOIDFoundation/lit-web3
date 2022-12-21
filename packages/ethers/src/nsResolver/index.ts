export { check } from './checker'
import { getContract, getContracts, useBridgeAsync, assignOverrides } from '../useBridge'
// import { formatBytes32String } from '@ethersproject/strings'

const getBridge = async () => (await useBridgeAsync()).bridge
const getAccount = async (account?: string) => account || (await getBridge()).account

export const getResolverContract = async (account?: string) =>
  getContract('Resolver', { account: await getAccount(account) })

// Queries

export const nameInfo = async (name: string, account?: string) => {
  if (!account) account = await getAccount(account)
  const contract = await getResolverContract(account)
  const res: NameInfo = { name, status: '', owner: '', available: false, itsme: false }
  try {
    const { owner, status } = await contract.statusOfName(name)
    Object.assign(res, { owner, available: status === 'available', status, itsme: owner === account })
  } catch (e) {
    Object.assign(res, { available: true })
  }
  return res
}
export const ownerNames = async (address: string, account?: string) => {
  const contract = await getResolverContract(account)
  return await contract.namesOfOwner(address)
}
export const ownerTokens = async (address: string, account?: string) => {
  const contract = await getResolverContract(account)
  return await contract.tokensOfOwner(address)
}

// Naming Service (NS) Methods https://docs.ethers.io/v5/api/providers/provider/#Provider--ens-methods
export const getResolver = async (name: string): Promise<string> => {
  return ''
}
export const lookupAddress = async (address: Address): Promise<string> => {
  return ''
}
export const resolveName = async (name: string): Promise<Address> => {
  return ''
}
// nsResolver https://docs.ethers.io/v5/api/providers/provider/#EnsResolver
export const name = (): string => {
  return ''
}
export const address = (): string => {
  return getContracts('Resolver')
}
export const getAddress = async (cointType = 60): Promise<Address | string> => {
  return ''
}

export const getContentHash = async (): Promise<string> => {
  return ''
}

export const getText = async (key: string): Promise<string> => {
  return ''
}
// reg-ish
export const exists = async (tokenId: number): Promise<boolean> => {
  return false
}
export const burn = async (tokenId: number): Promise<boolean> => {
  return false
}
// reg-ish from pass
export const mintWithPass = async (tokenId: number, passes: number[]): Promise<boolean> => {
  const method = passes.length > 1 ? 'mintWithPassIds' : 'mintWithPassId'
  return false
}
