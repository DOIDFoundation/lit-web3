import { Eip1193Provider } from 'ethers'
import EventEmitter from 'events'
import { options, updateOptions } from './options'
import { Chain } from './chains'
import { controller } from './controller'
import { InjectedConnector } from '@wagmi/core'

class DOIDConnector extends EventEmitter {
  get provider(): Eip1193Provider | undefined {
    return undefined
  }

  public updateOptions = updateOptions

  public setChains(chains?: Chain[]) {
    options.chains = chains
  }

  public async connect(showModel: boolean = true): Promise<Eip1193Provider> {
    return new Promise<Eip1193Provider>(async (resolve, reject) => {
      if (showModel) {
        await Promise.all([import('./dialog')])
        const modal = document.createElement('doid-connect-dialog')
        document.body.insertAdjacentElement('beforeend', modal)
        //   this.once(ADAPTER_EVENTS.CONNECTED, () => {
        //     return resolve(this.provider!)
        //   })
        //   this.once(ADAPTER_EVENTS.ERRORED, (err: unknown) => {
        //     return reject(err)
        //   })
      } else {
        controller.setConnector(new InjectedConnector())
        controller.connect().then(() => resolve(this.provider!))
      }
    })
  }
}

export const doidConnector = new DOIDConnector()
