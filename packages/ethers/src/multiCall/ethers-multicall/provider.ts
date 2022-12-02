// import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, Web3Provider, WebSocketProvider } from '@ethersproject/providers'

import { all } from './call'
import { getEthBalance } from './calls'
import { ContractCall } from './types'

type ethersProvider = Web3Provider | JsonRpcProvider | WebSocketProvider | any

export class Provider {
  private _provider: ethersProvider
  private _multicallAddress: string

  constructor(provider: ethersProvider, chainId?: number) {
    this._provider = provider
    this._multicallAddress = getAddressForChainId(chainId)
  }

  public async init() {
    // Only required if `chainId` was not provided in constructor
    this._multicallAddress = await getAddress(this._provider)
  }

  public getEthBalance(address: string) {
    if (!this._provider) {
      throw new Error('Provider should be initialized before use.')
    }
    return getEthBalance(address, this._multicallAddress)
  }

  public async all<T extends any[] = any[]>(calls: ContractCall[]) {
    if (!this._provider) {
      throw new Error('Provider should be initialized before use.')
    }
    return all<T>(calls, this._multicallAddress, this._provider)
  }
}

const multicallAddresses: Record<string, string> = {
  '0x1': '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  '0xaa36a7': '0x53c43764255c17bd724f74c4ef150724ac50a3ed'
}

export function setMulticallAddress(chainId: number, address: string) {
  multicallAddresses[chainId] = address
}

function getAddressForChainId(chainId: number = 80) {
  return multicallAddresses[chainId]
}

async function getAddress(provider: ethersProvider) {
  const { chainId } = await provider.getNetwork()
  return getAddressForChainId(chainId)
}
