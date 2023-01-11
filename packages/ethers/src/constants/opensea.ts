// OpenSea API
import Network from '../networks'

export const OpenSea: ChainConf = {
  url: {
    '0x1': 'https://opensea.io/assets/ethereum',
    '0xaa36a7': 'https://testnets.opensea.io/assets/sepolia',
    '0x5': 'https://testnets.opensea.io/assets/goerli'
  },
  api: {
    '0x1': 'https://api.opensea.io/api/v1/asset',
    '0xaa36a7': 'https://testnets-api.opensea.io/api/v1/asset',
    '0x5': 'https://testnets-api.opensea.io/api/v1/asset'
  }
}

export const getOpenseaUri = (name: string) => OpenSea[name][Network.chainId]

export default OpenSea
