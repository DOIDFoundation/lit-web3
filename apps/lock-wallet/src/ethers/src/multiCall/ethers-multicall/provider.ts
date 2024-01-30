import { JsonRpcProvider, BrowserProvider, WebSocketProvider } from 'ethers'

import { all } from './call'
import { getEthBalance } from './calls'
import { ContractCall } from './types'

type ethersProvider = BrowserProvider | JsonRpcProvider | WebSocketProvider | any

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
  1: '0xcA11bde05977b3631167028862bE2a173976CA11',
  5: '0xcA11bde05977b3631167028862bE2a173976CA11',
  4002: '0xcA11bde05977b3631167028862bE2a173976CA11',
  56797: '0x32A668a6bAAe81AF97e6527F1d114910f838350E'
}

export function setMulticallAddress(chainId: number, address: string) {
  multicallAddresses[chainId] = address
}

function getAddressForChainId(chainId: number = 1) {
  return multicallAddresses[chainId]
}

async function getAddress(provider: ethersProvider) {
  const { chainId } = await provider.getNetwork()
  return getAddressForChainId(chainId)
}
