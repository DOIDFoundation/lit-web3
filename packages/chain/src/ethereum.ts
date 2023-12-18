// Ethereum
import { bsc } from './ethereum.bsc'
const name: ChainName = 'ethereum'
const symbol = 'ETH'

export const ethereum: ChainNetworks = [
  // Ethereum
  {
    name,
    title: 'Ethereum',
    id: '0x1',
    rpc: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    rpcWs: 'wss://mainnet.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    scan: 'https://etherscan.io',
    symbol
  },
  {
    name,
    title: 'Goerli Testnet',
    abbr: 'Goerli',
    id: '0x5',
    rpc: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    rpcWs: 'wss://goerli.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    scan: 'https://goerli.etherscan.io',
    symbol,
    testnet: true
  },
  {
    name,
    title: 'Sepolia Testnet',
    abbr: 'Sepolia',
    id: '0xaa36a7',
    rpc: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    rpcWs: 'wss://sepolia.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    scan: 'https://sepolia.etherscan.io',
    symbol,
    testnet: true
  },
  // BNB Smart Chain
  ...bsc
]

export default <Chain>Object.fromEntries(ethereum.map((network) => [network.id, network]))
