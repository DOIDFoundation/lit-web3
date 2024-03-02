import { createConnector, normalizeChainId } from '@wagmi/core'
import type { IProvider, IWeb3Auth } from '@web3auth/base'
import * as pkg from '@web3auth/base'
import type { OpenloginLoginParams } from '@web3auth/openlogin-adapter'
import { Address, Chain, getAddress, SwitchChainError, UserRejectedRequestError } from 'viem'

export type Options = {
  web3AuthInstance: IWeb3Auth
  loginParams: OpenloginLoginParams
}

const { ADAPTER_STATUS, CHAIN_NAMESPACES, WALLET_ADAPTERS, log } = pkg

const IS_SERVER = typeof window === 'undefined'

web3auth.type = 'web3auth' as const
export function web3auth(options: Options) {
  type Provider = IProvider
  type Properties = {
    chains: readonly Chain[]
    provider: Provider | null
    loginParams: OpenloginLoginParams | null
    web3AuthInstance: IWeb3Auth
  }
  return createConnector<Provider, Properties>((config) => ({
    ready: !IS_SERVER,

    id: 'web3auth',

    get name() {
      return options.loginParams.loginProvider
    },

    type: web3auth.type,

    provider: null,

    chains: config.chains,

    loginParams: options.loginParams,

    web3AuthInstance: options.web3AuthInstance,

    async connect({ chainId }: { chainId?: number } = {}) {
      try {
        config.emitter.emit('message', {
          type: 'connecting'
        })

        this.provider = await this.getProvider()

        this.provider.on('accountsChanged', this.onAccountsChanged)
        this.provider.on('chainChanged', this.onChainChanged)

        if (!this.web3AuthInstance.connected) {
          if (this.loginParams) {
            await this.web3AuthInstance.connectTo(WALLET_ADAPTERS.OPENLOGIN, this.loginParams)
          } else {
            log.error('please provide valid loginParams when using @web3auth/no-modal')
            throw new UserRejectedRequestError(
              'please provide valid loginParams when using @web3auth/no-modal' as unknown as Error
            )
          }
        }

        const [accounts, connectedChainId] = await Promise.all([this.getAccounts(), this.getChainId()])
        let id = connectedChainId
        if (chainId && connectedChainId !== chainId) {
          // try switching chain
          const chain = await this.switchChain!({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code) throw error
            return { id: connectedChainId }
          })
          id = chain.id
        }
        return {
          accounts,
          chainId: id
        }
      } catch (error) {
        log.error('error while connecting', error)
        this.onDisconnect()
        throw new UserRejectedRequestError('Something went wrong' as unknown as Error)
      }
    },

    async getAccounts(): Promise<Address[]> {
      const provider = await this.getProvider()
      const accounts = await provider.request<unknown, string[]>({
        method: 'eth_accounts'
      })
      return (accounts ?? []).map((x) => getAddress(x!))
    },

    async getProvider() {
      if (this.provider) {
        return this.provider
      }
      if (this.web3AuthInstance.status === ADAPTER_STATUS.NOT_READY) {
        if (this.loginParams) {
          await this.web3AuthInstance.init()
        } else {
          log.error('please provide valid loginParams when using @web3auth/no-modal')
          throw new UserRejectedRequestError(
            'please provide valid loginParams when using @web3auth/no-modal' as unknown as Error
          )
        }
      }

      this.provider = this.web3AuthInstance.provider
      return this.provider!
    },

    async isAuthorized() {
      try {
        const accounts = await this.getAccounts()
        return !!accounts.length
      } catch {
        return false
      }
    },

    async getChainId(): Promise<number> {
      await this.getProvider()
      const chainId = await this.provider!.chainId
      log.info('chainId', chainId)
      return normalizeChainId(chainId)
    },

    async switchChain({ chainId }) {
      try {
        const chain = this.chains.find((x) => x.id === chainId)
        if (!chain) throw new SwitchChainError(new Error('chain not found on connector.'))

        await this.web3AuthInstance.addChain({
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: `0x${chain.id.toString(16)}`,
          rpcTarget: chain.rpcUrls.default.http[0],
          displayName: chain.name,
          blockExplorer: chain.blockExplorers?.default.url[0] || '',
          ticker: chain.nativeCurrency?.symbol || 'ETH',
          tickerName: chain.nativeCurrency?.name || 'Ethereum',
          decimals: chain.nativeCurrency.decimals || 18
        })
        log.info('Chain Added: ', chain.name)
        await this.web3AuthInstance.switchChain({ chainId: `0x${chain.id.toString(16)}` })
        log.info('Chain Switched to ', chain.name)
        return chain
      } catch (error: unknown) {
        log.error('Error: Cannot change chain', error)
        throw new SwitchChainError(error as Error)
      }
    },

    async disconnect(): Promise<void> {
      const provider = await this.getProvider()
      provider.removeListener('accountsChanged', this.onAccountsChanged)
      provider.removeListener('chainChanged', this.onChainChanged)
      await this.web3AuthInstance.logout()
    },

    onAccountsChanged: (accounts: string[]): void => {
      if (accounts.length === 0) config.emitter.emit('disconnect')
      else config.emitter.emit('change', { accounts: accounts.map((x) => getAddress(x)) })
    },
    onChainChanged: (chainId: string | number): void => {
      const id = normalizeChainId(chainId)
      config.emitter.emit('change', { chainId: id })
    },
    async onDisconnect(_error) {
      config.emitter.emit('disconnect')
    }
  }))
}
