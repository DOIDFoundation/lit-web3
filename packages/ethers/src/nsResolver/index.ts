export { check } from './checker'
import { bareTLD, wrapTLD } from './uts'
export { wrapTLD }
import { getResolverAddress, getAccount, getResolverContract, getProvider } from './controller'
import { formatUnits } from '@ethersproject/units'
import { randomBytes } from '@ethersproject/random'
import { coinTypes } from './checker'
import { BigNumber } from '@ethersproject/bignumber'

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
      const { owner, status } = await contract.statusOfName(bareTLD(name))
      const itsme = owner === account
      const locked = status === 'locked'
      const available = status === 'available' || (itsme && locked)
      Object.assign(nameInfo, {
        owner,
        available,
        registered: status === 'registered',
        stat: locked ? 'Locked by pass' : available ? 'Available' : 'Unavailable',
        status,
        itsme
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
export const ownerRecords = async (name?: string) => {
  if (!name) return
  let _name = bareTLD(name)
  let contract = await getResolverContract(getResolverAddress())
  const node_name = await contract.nameHash(_name)
  const addrs = await contract.addrs(node_name)
  const res: Record<string, any | null> = { ...coinTypes }
  addrs.map(([coinType, addr]: any) => {
    const type: string = formatUnits(coinType, 0)
    if (res[type]) res[type].address = addr
  })
  return Object.values(res)
}
export const setAddrSignMessage = async (name: string, account: string, coinType: number | string) => {
  let res
  try {
    const _name = bareTLD(name)
    let contract = await getResolverContract(getResolverAddress())
    // node, coinType, account, timestamp, nonce, signature
    const node_name = await contract.nameHash(_name)
    const provider = await getProvider()
    const bockNum = await provider.getBlockNumber()
    const timestamp = (await provider.getBlock(bockNum)).timestamp
    const nonce = BigNumber.from(randomBytes(32))
    const signature = await contract.makeAddrMessage(node_name, coinType, account, timestamp, nonce)
    res = {
      name,
      account,
      timestamp,
      nonce,
      signature
    }
  } catch (e: any) {
    console.error(e)
  }
  return res
}
export const setAddrByOwner = async (
  name: string,
  coinType: number | string,
  account: string,
  timestamp: number,
  nonce: number,
  signature: string
) => {
  let contract = await getResolverContract(getResolverAddress())
  try {
    return contract.setAddr(name, coinType, account, timestamp, nonce, signature)
  } catch (e: any) {}
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
