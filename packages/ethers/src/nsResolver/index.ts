export { check } from './checker'
import { wrapTLD } from './uts'
import { getResolverAddress, getAccount, getResolverContract } from './controller'

// Queries
export const nameInfo = async (name: string, account?: string) => {
  name = wrapTLD(name)
  if (!account) account = await getAccount(account)
  const contract = await getResolverContract(account)
  const res: NameInfo = { name, status: '', owner: '', available: false, itsme: false }
  try {
    const { owner, status } = await contract.statusOfName(name)
    const itsme = owner === account
    Object.assign(res, { owner, available: itsme || status === 'available', status, itsme })
  } catch (e) {
    console.log(e)
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
export const address = getResolverAddress
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
