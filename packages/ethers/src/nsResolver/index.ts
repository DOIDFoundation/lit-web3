export { check } from './checker'
import { bareTLD, wrapTLD } from './uts'
export { wrapTLD }
import { getResolverAddress, getAccount, getResolverContract } from './controller'
import { formatUnits } from '@ethersproject/units'

// Queries
export const nameInfo = async <T extends string | string[]>(req: T, account?: string) => {
  const get = async (name: string) => {
    name = wrapTLD(name)
    if (!account) account = await getAccount(account)
    const contract = await getResolverContract(account)
    const nameInfo: NameInfo = {
      name,
      status: '',
      owner: '',
      available: false,
      itsme: false,
      registered: false,
      stat: ''
    }
    try {
      const res = await contract.statusOfName(bareTLD(name))
      const { owner, status } = res
      const id = formatUnits(res.id, 0)
      const itsme = owner === account
      const locked = status === 'locked'
      const available = status === 'available' || (itsme && locked)
      const registered = status === 'registered'
      Object.assign(nameInfo, {
        owner,
        available,
        registered,
        stat: locked ? 'Locked by pass' : available ? 'Available' : 'Unavailable',
        status,
        itsme,
        id,
        locked
      })
    } catch (e) {
      Object.assign(nameInfo, { available: true })
    }
    return nameInfo
  }
  if (Array.isArray(req)) return await Promise.all(req.map(get))
  return await get(req)
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
