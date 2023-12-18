import { ethereum } from './ethereum'
import { aptos } from './aptos'
import { doid } from './doid'
import { solana } from './solana'
import { bitcoin } from './bitcoin'

export const getNetwork = (name: ChainName, chainId: string) => {
  const networks = multiChain[name]
  return networks.find((r) => r.id === chainId || +r.id === +chainId) ?? networks[0]
}

// 0 as default
export const multiChain: MultiChain = {
  doid,
  ethereum,
  aptos,
  solana,
  bitcoin
}

export const multiChains: BlockChains = Object.values(multiChain).map((networks) => networks[0])
