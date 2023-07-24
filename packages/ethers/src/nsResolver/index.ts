import { bareTLD, wrapTLD } from './checker'

import { getAccount, getBridgeProvider, assignOverrides, getSigner } from '../useBridge'
import { getResolverAddress, getResolverContract } from './controller'
import { formatUnits, randomBytes } from 'ethers'
import { getRecords } from './checker'
import { txReceipt } from '../txReceipt'

// Queries
export const cookNameInfo = (src: Record<string, any>, opts = {}): NameInfo => {
  if ('toObject' in src) src = src.toObject()
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

type NameInfoParam<T> = T extends Array<infer P> ? NameInfo[] : NameInfo
export const nameInfo = async <T>(req: T, account?: string): Promise<NameInfoParam<T>> => {
  const get = async (name: any): Promise<any> => {
    if (!account) account = await getAccount()
    const contract = await getResolverContract()
    name = wrapTLD(name)
    const nameInfo: NameInfo = { name, account }
    try {
      const res = await contract.statusOfName(bareTLD(name))
      // TOOD: S need native support by contract
      const res2 = await ownerRecords(name)
      Object.assign(nameInfo, {
        publicKey: '',
        mainAddress: (res2?.find((r: any) => r.name === 'ETH') as any)?.address ?? ''
      })
      // E
      Object.assign(nameInfo, cookNameInfo(res, nameInfo))
    } catch {}
    return nameInfo
  }
  if (Array.isArray(req)) return <any>await Promise.all(req.map(get))
  return await get(req)
}
export const ownerNames = async (owner: string, account?: string) => {
  if (!account) account = await getAccount()
  const contract = await getResolverContract()
  const names = []
  try {
    const res = await contract.namesOfOwner(owner)
    names.push(...res.map((ref: any) => cookNameInfo(ref, { owner, account, status: 'registered' })))
  } catch (e) {
    console.error(e)
    throw e
  }
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

const randomNonce = () =>
  `0x${Array.from(randomBytes(32))
    .map((i) => i.toString(16).padStart(2, '0'))
    .join('')}`

export const getSignerMessage = async (name: string, account: string, coinType: number | string) => {
  let contract = await getResolverContract()
  const provider = await getBridgeProvider()
  //input: node, coinType, account, timestamp, nonce
  //
  const _name = bareTLD(name)
  const blockNum = await provider.getBlockNumber()
  const timestamp = (await provider.getBlock(blockNum)).timestamp
  const nonce = randomNonce()
  // const contract.makeMainAddrMessage(_name)
  const message = await contract.makeAddrMessage(_name, coinType, account, timestamp, nonce)
  return { name, dest: account, timestamp, nonce, message }
}

export const signMessage = async (msg: string, address: string) => {
  const signer = await getSigner(address)
  const signature = await signer.signMessage(msg)
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

export const ipnsBytes = async (name = '') => {
  if (!name) return
  try {
    const _name = bareTLD(name)
    const contract = await getResolverContract()
    return await contract.ipnsOfName(_name)
  } catch (e) {
    console.error(e)
  }
}

export const mainAddressByName = async (name: string) => {
  if (!name) return
  try {
    const _name = bareTLD(name)
    const contract = await getResolverContract()
    return await contract.mainAddrOfName(_name)
  } catch (e: any) {
    console.error(e)
  }
}

export const setMainAddrAndIPNS = async (name: string, address: string, bytes: any) => {
  const _name = bareTLD(name)
  try {
    let contract = await getResolverContract()
    const method = 'setMainAddrAndIPNS'
    const overrides = {}
    const { name: name1, timestamp, nonce, message } = await getSignerMessageByMainAddress(_name, address)
    const { signature } = await signMessage(message, address)
    const parameters = [name1, address, +timestamp, nonce, signature, bytes]

    console.log('---setMainAddrAndIPNS---\n', { name1, address, timestamp, nonce, signature, bytes }, '\n')
    await assignOverrides(overrides, contract, method, parameters)
    const call = contract[method](...parameters)
    return new txReceipt(call, {
      errorCodes: 'Resolver',
      allowAlmostSuccess: true,
      seq: {
        type: 'setMainAddrAndIPNS',
        title: `set main address ${address} and ipns`,
        ts: new Date().getTime(),
        overrides
      }
    })
  } catch (e) {
    console.error(e)
  }
}

export const getSignerMessageByMainAddress = async (name: string, account: string) => {
  let contract = await getResolverContract()
  const provider = await getBridgeProvider()
  //input: node, coinType, account, timestamp, nonce
  //
  const _name = bareTLD(name)
  const blockNum = await provider.getBlockNumber()
  const timestamp = (await provider.getBlock(blockNum)).timestamp
  const nonce = randomNonce()
  const message = await contract.makeMainAddrMessage(_name, account, timestamp, nonce)
  // const message = await contract.makeAddrMessage(_name, coinType, account, timestamp, nonce)
  return { name, dest: account, timestamp, nonce, message }
}
