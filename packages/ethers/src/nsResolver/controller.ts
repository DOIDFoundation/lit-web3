import { getContract, getContracts, useBridgeAsync, assignOverrides } from '../useBridge'
import { txReceipt } from '../txReceipt'
export { assignOverrides, txReceipt }
// import { formatBytes32String } from '@ethersproject/strings'

export const getBridge = async () => (await useBridgeAsync()).bridge
export const getAccount = async (account?: string) => account || (await getBridge()).account
export const getSigner = async (account?: string) => (await getBridge()).provider.getSigner(await getAccount(account))
export const getResolverAddress = () => getContracts('Resolver')
export const getChainId = async () => (await getBridge()).network.current.chainId
export const getProvider = async () => (await getBridge()).provider

export const getResolverContract = async (account?: string) =>
  getContract('Resolver', { account: await getAccount(account) })
