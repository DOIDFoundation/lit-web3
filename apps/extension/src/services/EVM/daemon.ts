import { getKeyring } from '~/lib.next/keyring'
import { Wallet, HDNodeWallet, JsonRpcProvider, Provider } from 'ethers'
import { NetworkStorage } from '~/lib.next/background/storage/preferences'
import emitter from '@lit-web3/core/src/emitter'

export const EVM = {
  provider: <Provider | undefined>undefined,
  wallet: <InstanceType<typeof HDNodeWallet> | undefined>undefined
}
let promise: any

export const getEVMProvider = async () => {
  if (EVM.provider) return EVM
  return await (promise || (promise = new Promise(async (resolve) => resolve(await initEVMProvider()))))
}

let inited = false
const initEVMProvider = async () => {
  // Provider
  const {
    rpc: [selectedRpc],
    id: selectedChainId
  } = await NetworkStorage.get('ethereum')
  EVM.provider = new JsonRpcProvider(selectedRpc, +selectedChainId)
  // Wallet
  await refreshWallet()
  if (!inited) {
    inited = true
    emitter.on('keyring_update', refreshWallet)
    emitter.on('unlock', refreshWallet)
  }
  return EVM
}

const refreshWallet = async () => {
  try {
    const keyring = await getKeyring()
    EVM.wallet = Wallet.fromPhrase(keyring.phrase, EVM.provider)
  } catch {
    EVM.wallet = undefined
  }
}
