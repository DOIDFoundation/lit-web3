// DOID
const name: ChainName = 'doid'
const symbol = 'DOID'

export const doid: ChainNetworks = [
  // {
  //   name,
  //   title: 'DOID Mainnet',
  //   abbr: 'Mainnet',
  //   id: '1',
  //   rpc: 'https://api.doid.tech',
  //   rpcWs: 'ws://api.doid.tech/ws',
  //   scan: 'http://explorer.doid.tech',
  //   symbol
  // },
  {
    name,
    title: 'DOID Testnet',
    abbr: 'Testnet',
    id: '2',
    rpc: 'http://54.221.168.235:8556',
    rpcWs: 'ws://54.221.168.235:8557',
    scan: 'http://explorer.testnet.doid.tech',
    symbol,
    testnet: true
  }
]

export default <Chain>Object.fromEntries(doid.map((network) => [network.id, network]))
