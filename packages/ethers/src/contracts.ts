import Network from './networks'
import { useBridgeAsync } from './useBridge'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
// import { hexlify } from '@ethersproject/bytes'
import { gasLimit } from './utils'
import { normalizeTxErr } from './parseErr'

export { gasLimit }
export const estimateGasLimit = async (
  contract: Contract,
  method: string,
  parameters = <any>[],
  limitPercent?: number
) => {
  let estimatedGas = BigNumber.from(1000000)
  try {
    estimatedGas = BigNumber.from(await contract.estimateGas[method](...parameters))
  } catch (err) {
    normalizeTxErr(err, [method, parameters])
    throw err
  }
  const limit = gasLimit(estimatedGas)
  return limitPercent ? [limit, gasLimit(estimatedGas, limitPercent)] : limit
}

export const getNonce = async (address?: string) => {
  const { bridgeInstance } = await useBridgeAsync()
  let { provider, account } = bridgeInstance
  return await provider.getTransactionCount(address || account)
}
export const assignOverrides = async (overrides: any, ...args: any[]) => {
  let [contract, method, parameters, { gasLimitPer } = <any>{}] = args
  let gasLimit
  if (gasLimitPer) {
    gasLimit = (<any>await estimateGasLimit(contract, method, parameters, gasLimitPer))[1]
  } else {
    gasLimit = await estimateGasLimit(contract, method, parameters)
  }
  Object.assign(overrides, { gasLimit })
}

const getContracts = (name: string, forceMainnet = false): string => {
  const chainId = forceMainnet ? Network.mainnetChainId : Network.chainId
  return ContractsList[name][chainId]
}
export default getContracts

export const getAccount = async (): Promise<string> => {
  const provider = (await useBridgeAsync()).bridge.provider
  const res = (await provider.send('eth_requestAccounts')) ?? []
  return res[0] ?? ''
}

const ContractsList: ContractConf = <any>import.meta.env.VITE_APP_CONTRACTS

export const getABI = async (name: string) => await import(`./abi/${name}.json`)
