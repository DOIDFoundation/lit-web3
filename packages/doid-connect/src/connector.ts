import EventEmitter from 'events'
import { updateChains, updateOptions } from './options'
import { controller } from './controller'
import { ConnectorData, InjectedConnector, WalletClient } from '@wagmi/core'
import { DOIDConnectDialog } from './dialog'
import { StateController } from '@lit-app/state'
import { ReactiveControllerHost } from 'lit'

export class DOIDConnector extends EventEmitter {
  constructor(host?: ReactiveControllerHost) {
    super()
    if (host) this.bindState(host)
  }

  public bindState(host: ReactiveControllerHost) {
    return new StateController(host, controller)
  }

  get connected(): boolean {
    return controller.connected
  }

  get chainId() {
    return controller.chainId
  }

  get account() {
    return controller.account
  }

  public getWalletClient(chainId?: number): Promise<WalletClient> {
    return controller.getWalletClient(chainId)
  }

  public updateOptions = updateOptions
  public updateChains = updateChains

  public async connect(showModel: boolean = true): Promise<Required<ConnectorData>> {
    if (showModel) {
      return new Promise<Required<ConnectorData>>(async (resolve, reject) => {
        await Promise.all([import('./dialog')])
        const modal = document.createElement('doid-connect-dialog') as DOIDConnectDialog
        document.body.insertAdjacentElement('beforeend', modal)
        modal.addEventListener(DOIDConnectDialog.EVENTS.CONNECTED, (ret: any) => resolve(ret))
        modal.addEventListener(DOIDConnectDialog.EVENTS.ERROR, (err: any) => reject(err))
      })
    } else {
      return controller.connect()
    }
  }
}
