import { getContract, getContracts, getSigner } from '../useBridge'
export { getSigner }
// import { formatBytes32String } from '@ethersproject/strings'

export const getResolverAddress = () => getContracts('Resolver')
export const getResolverContract = async () => getContract('Resolver')
