import { getKeyring } from '~/lib.next/keyring'
import { Wallet, HDNodeWallet, JsonRpcProvider, Provider } from 'ethers'
import { NetworkStorage, ConnectsStorage } from '~/lib.next/background/storage/preferences'
import emitter from '@lit-web3/core/src/emitter'
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

// TODO: only send to subscribers
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
  if (inited) return EVM
  inited = true
  emitter.on('connect_change', emitAccountsChanged)
  emitter.on('lock', emitAccountsChanged)
  emitter.on('unlock', emitAccountsChanged)
  emitter.on('keyring_update', refreshWallet)
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
