// DOID
const name: ChainName = 'doid'
const symbol = 'DOID'

export const doid: ChainNetworks = [
  {
    name,
    title: 'DOID Testnet',
    abbr: 'Testnet',
    id: 'testnet',
    rpc: 'http://54.221.168.235:8556',
    rpcWs: 'ws://54.221.168.235:8557',
    scan: 'http://explorer.testnet.doid.tech',
    symbol,
    testnet: true
  }
]

export default <Chain>Object.fromEntries(doid.map((network) => [network.id, network]))
