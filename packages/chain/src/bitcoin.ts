// Bitcoin
const name: ChainName = 'bitcoin'
const symbol = 'BTC'

export const bitcoin: ChainNetworks = [{ name, title: 'Bitcoin', id: 'mainnet', rpc: '', scan: '', symbol }]

export default <Chain>Object.fromEntries(bitcoin.map((network) => [network.id, network]))
