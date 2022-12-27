export { checkDOIDName } from './checker'
import { bareTLD, wrapTLD } from './uts'
export { wrapTLD }

import { getAccount, getBridgeProvider, assignOverrides, getSigner } from '../useBridge'
import { getResolverAddress, getResolverContract } from './controller'
import { formatUnits } from '@ethersproject/units'
import { randomBytes } from '@ethersproject/random'
import { getRecords } from './checker'
import { BigNumber } from '@ethersproject/bignumber'
import { txReceipt } from '../txReceipt'

// Queries
export const cookNameInfo = (src: Record<string, any>, opts = {}): NameInfo => {
  const data: Record<string, any> = { ...src, ...opts }
  const { owner, status, account } = data
  const itsme = !!account && owner.toLowerCase() === account.toLowerCase()
  const locked = status === 'locked'
  const available = status === 'available' || (itsme && locked)
  const registered = status === 'registered'
  let stat = locked ? 'Locked by pass' : available ? 'Available' : 'Unavailable'
  if (registered && itsme) stat = 'Registered'
  const cooked = {
    name: wrapTLD(data.name),
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
    if (!account) account = await getAccount()
    const contract = await getResolverContract()
    name = wrapTLD(name)
    const nameInfo: any = { name, account }
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
  if (!account) account = await getAccount()
  const contract = await getResolverContract()
  const names = []
  try {
    const res = await contract.namesOfOwner(owner)
    names.push(...res.map((ref: any) => cookNameInfo(ref, { owner, account, status: 'registered' })))
  } catch (err) {}
  return names
}
export const ownerTokens = async (address: string) => {
  const contract = await getResolverContract()
  return await contract.tokensOfOwner(address)
}
export const ownerRecords = async (name?: string) => {
  if (!name) return
  let _name = bareTLD(name)
  let contract = await getResolverContract()
  const node_name = await contract.nameHash(_name)
  const addrs = await contract.addrs(node_name)
  const res = await getRecords()
  addrs.forEach(([coinType, addr]: any) => {
    const type: string = formatUnits(coinType, 0)
    if (res[type]) res[type].address = addr
  })
  return Object.values(res)
}

export const getSignerMessage = async (name: string, account: string, coinType: number | string) => {
  let contract = await getResolverContract()
  const provider = await getBridgeProvider()
  //input: node, coinType, account, timestamp, nonce
  //
  const _name = bareTLD(name)
  const blockNum = await provider.getBlockNumber()
  const timestamp = (await provider.getBlock(blockNum)).timestamp
  const nonce = BigNumber.from(randomBytes(32))
  const message = await contract.makeAddrMessage(_name, coinType, account, timestamp, nonce)
  return { name, dest: account, timestamp, nonce: nonce._hex, message }
}

export const signMessage = async (msg: string) => {
  const signature = await (await getSigner()).signMessage(msg)
  return { signature }
}

export const setAddressByOwner = async (
  name: string,
  coinType: number | string,
  account: string,
  timestamp: number,
  nonce: string,
  signature: string
) => {
  let contract = await getResolverContract()
  const method = 'setAddr'
  const overrides = {}
  const parameters = [bareTLD(name), coinType, account, +timestamp, nonce, signature]

  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  return new txReceipt(call, {
    errorCodes: 'Resolver',
    allowAlmostSuccess: true,
    seq: {
      type: 'setAddr',
      title: `set Address ${account}`,
      ts: new Date().getTime(),
      overrides
    }
  })
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
