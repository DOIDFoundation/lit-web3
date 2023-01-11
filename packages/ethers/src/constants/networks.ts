// All Networks
export const AllNetworks = {
  '0x1': {
    chainId: '0x1',
    title: 'Mainnet',
    name: 'mainnet',
    // provider: 'https://rpc.ankr.com/eth',
    // providerWs: 'wss://rpc.ankr.com/ws'
    provider: 'https://mainnet.infura.io/v3/50e9845f779f4770a64fa6f47e238d10',
    providerWs: 'wss://mainnet.infura.io/ws/v3/50e9845f779f4770a64fa6f47e238d10',
    scan: 'https://etherscan.io',
    icon: '',
    graph: 'https://api.studio.thegraph.com/query/38900/artscan/v2.0.5',
    opensea: 'https://opensea.io/assets/ethereum',
    openseaApi: 'https://api.opensea.io/api/v1/asset/'
  },
  '0xaa36a7': {
    chainId: '0xaa36a7',
    title: 'Sepolia Testnet',
    name: 'SepoliaTestnet',
    // provider: 'https://rpc.sepolia.dev',
    // providerWs: 'wss://rpc.sepolia.dev/ws',
    provider: 'https://sepolia.infura.io/v3/50e9845f779f4770a64fa6f47e238d10',
    providerWs: 'wss://sepolia.infura.io/ws/v3/50e9845f779f4770a64fa6f47e238d10',
    scan: 'https://sepolia.etherscan.io',
    icon: '',
    graph: 'https://api.studio.thegraph.com/query/38900/artscan/v2.0.5',
    opensea: 'https://testnets.opensea.io/assets/sepolia',
    openseaApi: 'https://testnets-api.opensea.io/api/v1/assets'
  },
  '0x5': {
    chainId: '0x5',
    title: 'Görli Testnet',
    name: 'GoerliTestnet',
    // provider: 'https://rpc.goerli.dev',
    // providerWs: 'wss://rpc.goerli.dev/ws',
    provider: 'https://goerli.infura.io/v3/50e9845f779f4770a64fa6f47e238d10',
    providerWs: 'wss://goerli.infura.io/ws/v3/50e9845f779f4770a64fa6f47e238d10',
    scan: 'https://goerli.etherscan.io',
    icon: '',
    graph: 'https://api.studio.thegraph.com/query/38900/artscan/v2.0.17',
    opensea: 'https://testnets.opensea.io/assets/goerli',
    openseaApi: 'https://testnets-api.opensea.io/api/v1/assets'
  }
}
export const EtherNetworks = ['0x1', '0xaa36a7', '0x5']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
