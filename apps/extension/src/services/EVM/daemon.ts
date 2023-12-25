import { getKeyring } from '~/lib.next/keyring'
import { Wallet, HDNodeWallet, JsonRpcProvider, Provider } from 'ethers'
import { networkStorage, ConnectsStorage } from '~/lib.next/background/storage/preferences'
import emitter from '@doid/core/emitter'
import backgroundToInpage from '~/lib.next/messenger/background'
import { names2Addresses } from '~/services/shared'

export const EVM = {
  provider: <Provider | undefined>undefined,
  wallet: <InstanceType<typeof HDNodeWallet> | undefined>undefined
}
let promise: any

export const getEVMProvider = async () => {
  if (EVM.provider) return EVM
  return await (promise || (promise = new Promise(async (resolve) => resolve(await initEVMProvider()))))
}

// TODO: Refer to https://docs.metamask.io/wallet/reference/eth_subscribe/
// TODO: Only send to evm subscribers
const emitAccountsChanged = async () => {
  const connects: Connects = await ConnectsStorage.getAll()
  const { isUnlocked } = await getKeyring()
  await Promise.all(
    Object.entries(connects).map(async ([host, { names = [] }]) => {
      if (!isUnlocked) names = []
      const addresses = await names2Addresses(names)
      backgroundToInpage.send('evm_response', { method: 'accountsChanged', params: addresses }, { host })
    })
  )
}
// TODO: Only send to evm subscribers
const emitChainChanged = async () => {
  refreshWallet()
  const { id } = await networkStorage.get('ethereum')
  backgroundToInpage.broadcast('evm_response', { method: 'chainChanged', params: id })
}

let inited = false
const initEVMProvider = async () => {
  await refreshWallet()
  if (inited) return EVM
  inited = true
  emitter.on('connect_change', emitAccountsChanged)
  emitter.on('lock', emitAccountsChanged)
  emitter.on('unlock', emitAccountsChanged)
  emitter.on('keyring_update', refreshWallet)
  emitter.on('network_change', emitChainChanged)
  return EVM
}

const refreshWallet = async () => {
  // Provider
  const { rpc, id } = await networkStorage.get('ethereum')
  EVM.provider = new JsonRpcProvider(rpc, +id)
  // Wallet
  try {
    const keyring = await getKeyring()
    EVM.wallet = Wallet.fromPhrase(keyring.phrase, EVM.provider)
  } catch {
    EVM.wallet = undefined
  }
}
