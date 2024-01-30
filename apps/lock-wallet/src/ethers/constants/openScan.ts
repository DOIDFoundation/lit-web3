// OpenSea API
import Network from '../networks'

const apiKeyAlchemy = import.meta.env.VITE_KEY_ALCHEMY

export const openScan: Record<string, ChainConf> = {
  alchemy: {
    api: {
      '0x1': `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKeyAlchemy}`,
      '0x5': `https://eth-goerli.g.alchemy.com/nft/v3/${apiKeyAlchemy}`
    }
  },
  opensea: {
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
}

export const getScanUrl = (provider: string) => openScan[provider].url[Network.chainId]
export const getScanApi = (provider: string) => openScan[provider].api[Network.chainId]
