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
    emitter.on('connect_change', async (e: CustomEvent) => {
      refreshWallet()
      const connects = e.detail ?? (await ConnectsStorage.getAll())
      const tabs = await backgroundToInpage.getAllTabs()
      tabs.forEach(async ({ url, id }) => {
        if (!url) return
        const { host } = new URL(url)
        const { names = [] } = connects[host] ?? {}
        if (!names.length) return
        const accounts = await names2Addresses(names)
        backgroundToInpage.send('evm_response', { method: 'accountsChanged', params: accounts }, `window@${id}`)
      })
    })
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
