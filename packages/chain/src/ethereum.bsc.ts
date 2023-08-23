// BSC
const name: ChainName = 'ethereum'
const symbol = 'BNB'

export const bsc: ChainNetworks = [
  {
    name,
    title: 'BNB Smart Chain',
    abbr: 'BSC',
    id: '0x38',
    rpc: 'https://bsc-dataseed.binance.org',
    scan: 'https://bscscan.com',
    symbol
  },
  {
    name,
    title: 'BNB Smart Chain Testnet',
    abbr: 'BSC Testnet',
    id: '0x61',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    scan: 'https://testnet.bscscan.com',
    symbol,
    testnet: true
  }
]

export default <Chain>Object.fromEntries(bsc.map((network) => [network.id, network]))
