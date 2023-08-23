// Aptos
const name: ChainName = 'aptos'
const symbol = 'APT'

export const aptos: ChainNetworks = [
  {
    name,
    title: 'Aptos',
    id: '1',
    rpc: 'http://aptos-mainnet-rpc.allthatnode.com/v1',
    scan: 'https://explorer.aptoslabs.com/?network=mainnet',
    symbol
  },
  {
    name,
    title: 'Aptos Testnet',
    abbr: 'Testnet',
    id: '2',
    rpc: 'http://aptos-testnet-rpc.allthatnode.com/v1',
    scan: 'https://explorer.aptoslabs.com/?network=testnet',
    symbol,
    testnet: true
  }
]

export default <Chain>Object.fromEntries(aptos.map((network) => [network.id, network]))
