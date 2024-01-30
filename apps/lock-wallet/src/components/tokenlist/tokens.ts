import { getNetwork } from "~/ethers/networks"

const tokenList = [
  {
    "symbol": "USDT",
    "name": "Tether",
    "networks": {
      "0x1": {
        "contract": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "decimals": 6
      },
      "0xdddd": {
        "contract": "",
        "decimals": 6
      },
      "0xd01d": {
        "contract": "",
        "decimals": 6
      },
      "0X38": {
        "contract": "0x55d398326f99059fF775485246999027B3197955",
        "decimals": 18
      }
    },
    "decimals": 6,
    "logoURI": "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
  },
  {
    "symbol": "USDC",
    "name": "USD Coin",
    "networks": {
      "0x1": {
        "contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "decimals": 6
      },
      "0xdddd": {
        "contract": "",
        "decimals": 6
      },
      "0xd01d": {
        "contract": "",
        "decimals": 6
      },
      "0X38": {
        "contract": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        "decimals": 18
      }
    },
    "decimals": 6,
    "logoURI": "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
  },
  {
    "symbol": "ETH",
    "name": "Ethereum",
    "networks": {
      "0x1": {
        "contract": "native",
        "decimals": 18
      },
      "0xdddd": {
        "contract": "",
        "decimals": 18
      },
      "0xd01d": {
        "contract": "",
        "decimals": 18
      },
      "0X38": {
        "contract": "0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA",
        "decimals": 18
      }
    },
    "decimals": 18,
    "logoURI": "",
  },
  {
    "symbol": "DOID",
    "name": "DOID",
    "networks": {
      "0x1": {
        "contract": "",
        "decimals": 18
      },
      "0xdddd": {
        "contract": "native",
        "decimals": 18,
        "name": "DOID testnet"
      },
      "0xd01d": {
        "contract": "native",
        "decimals": 18,
        "name": "DOID Mainnet"
      },
      "0X38": {
        "contract": "",
        "decimals": 18
      }
    },
    "decimals": 18,
    "logoURI": "",
  }
]

const getList = async () => {
  const network = await getNetwork()
  const chainId = network.chainId
  const tokens = tokenList.filter((item: any) => {
    return item.networks[chainId].contract
  }).map((item: any) => {
    return Object.assign(item, item.networks[chainId])
  }).sort((a: any, b: any) => {
    if (a.contract === 'native') {
      return -1
    }
    return 0
  })
  console.log(tokens, 'tokens');

}

export { getList }
