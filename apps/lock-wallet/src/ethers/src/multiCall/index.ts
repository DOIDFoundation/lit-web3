// ethers-multicall
import { Contract, Provider } from './ethers-multicall'
import { getContracts, getBridgeProvider, getABI } from '../useBridge'

let MultiCallProvider: any

export const getMultiCallProvider = async () => {
  const provider = await getBridgeProvider()
  const { chainId: bridgeChainId } = await provider.getNetwork()
  let { chainId } = MultiCallProvider?._provider?.network ?? {}
  if (!chainId || chainId != bridgeChainId) MultiCallProvider = new Provider(provider, Number(bridgeChainId))
  return MultiCallProvider
}

export const getMultiCallContract = async (
  name: string,
  { forceMainnet = false, address = '', abiName = '' } = <multiCallOpts>{}
) => {
  if (!address) {
    address = getContracts(name, forceMainnet)
    if (!address) throw new Error(`Contract ${name} not found`)
  }
  return new Contract(address, await getABI(abiName || name))
}

export const getMultiCall = async (name: string, options?: multiCallOpts) => {
  return {
    MultiCallContract: await getMultiCallContract(name, options),
    MultiCallProvider: await getMultiCallProvider()
  }
}

export declare type multiCallOpts = {
  forceMainnet?: boolean
  address?: string
  abiName?: string
}

export default getMultiCall
