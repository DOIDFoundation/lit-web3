export { check } from './checker'
import { bareTLD, wrapTLD } from './uts'
export { wrapTLD }
import { getResolverAddress, getAccount, getResolverContract } from './controller'
import { formatUnits } from '@ethersproject/units'

// Queries
export const cookNameInfo = (src: Record<string, any>, opts = {}): NameInfo => {
  const data: Record<string, any> = { ...src, ...opts }
  const { owner, status, account } = data
  const itsme = owner === account && !!account
  const locked = status === 'locked'
  const available = status === 'available' || (itsme && locked)
  const registered = status === 'registered'
  let stat = locked ? 'Locked by pass' : available ? 'Available' : 'Unavailable'
  if (registered && itsme) stat = 'Registered'
  const cooked = {
    name: wrapTLD(data.name ?? name),
    owner,
    available,
    registered,
    stat,
    status,
    itsme,
    id: formatUnits(data.id || 0, 0),
    locked
  }
  return cooked
}
export const nameInfo = async <T extends string | string[]>(req: T, account?: string) => {
  const get = async (name: string): Promise<NameInfo> => {
    if (!account) account = await getAccount(account)
    const contract = await getResolverContract(account)
    const nameInfo: any = { name: wrapTLD(name), account }
    try {
      const res = await contract.statusOfName(bareTLD(name))
      Object.assign(nameInfo, cookNameInfo(res, nameInfo))
    } catch (e) {}
    return nameInfo
  }
  if (Array.isArray(req)) return await Promise.all(req.map(get))
  return await get(req)
}
export const ownerNames = async (owner: string, account?: string) => {
  if (!account) account = await getAccount(account)
  const contract = await getResolverContract(account)
  const names = []
  try {
    const res = await contract.namesOfOwner(owner)
    names.push(...res.map((ref: any) => cookNameInfo(ref, { owner, account, status: 'registered' })))
  } catch (err) {}
  return names
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
