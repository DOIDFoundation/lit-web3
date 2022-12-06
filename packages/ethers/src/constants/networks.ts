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
    icon: ''
  },
  '0xaa36a7': {
    chainId: '0xaa36a7',
    title: 'Sepolia Testnet',
    name: 'testnet',
    // provider: 'https://rpc.sepolia.dev',
    // providerWs: 'wss://rpc.sepolia.dev/ws',
    provider: 'https://sepolia.infura.io/v3/50e9845f779f4770a64fa6f47e238d10',
    providerWs: 'wss://sepolia.infura.io/ws/v3/50e9845f779f4770a64fa6f47e238d10',
    scan: 'https://sepolia.etherscan.io',
    icon: ''
  }
}
export const EtherNetworks = ['0x1', '0xaa36a7']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
