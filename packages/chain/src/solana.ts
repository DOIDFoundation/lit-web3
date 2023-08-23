// Solana
const name: ChainName = 'solana'
const symbol = 'SOL'

export const solana: ChainNetworks = [
  {
    name,
    title: 'Solana',
    id: 'mainnet',
    rpc: 'https://api.mainnet-beta.solana.com',
    scan: 'https://explorer.solana.com',
    symbol
  },
  {
    name,
    title: 'Solana Testnet',
    abbr: 'Testnet',
    id: 'testnet',
    rpc: 'https://api.testnet.solana.com',
    scan: 'https://explorer.solana.com/?cluster=testnet',
    symbol,
    testnet: true
  }
]

export default <Chain>Object.fromEntries(solana.map((network) => [network.id, network]))
