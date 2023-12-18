import { ERR_USER_DENIED } from '~/lib.next/constants'
export const noAuthMethods = Object.freeze(['eth_chainId', 'eth_blockNumber', 'eth_accounts'])
export const noConnectMethods = Object.freeze(['wallet_switchEthereumChain', 'wallet_addEthereumChain'])
export const USER_DENIED = { code: 4001, message: ERR_USER_DENIED }
