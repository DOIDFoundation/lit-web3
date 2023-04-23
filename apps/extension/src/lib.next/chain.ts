export const enum ChainName {
  ethereum = 'ethereum',
  solana = 'solana',
  aptos = 'aptos',
  bsc = 'bsc',
  bitcoin = 'bitcoin'
}
export const enum ChainCoin {
  ethereum = 'eth',
  solana = 'sol',
  aptos = 'apt',
  bsc = 'bsc',
  bitcoin = 'btc'
}

export const ChainsDefaultDef = (): ChainNet[] => {
  return [
    { name: ChainName.ethereum, title: 'Ethereum', coin: ChainCoin.ethereum },
    { name: ChainName.bitcoin, title: 'BitCoin', coin: ChainCoin.bitcoin },
    { name: ChainName.bsc, title: 'BNB Smart Chain', coin: ChainCoin.bsc },
    { name: ChainName.aptos, title: 'Aptos', coin: ChainCoin.aptos },
    { name: ChainName.solana, title: 'Solana', coin: ChainCoin.solana }
  ].filter((r) => r.name != 'bitcoin')
}

export const chainsDefault = ChainsDefaultDef()
