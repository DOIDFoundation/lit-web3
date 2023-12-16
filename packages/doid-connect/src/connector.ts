import EventEmitter from 'events'
import { options, updateChains, updateOptions } from './options'
import { controller } from './controller'
import { Address, Chain, ConnectorData, WalletClient } from '@wagmi/core'
import { DOIDConnectDialog } from './connectDialog'
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

  get doid() {
    return controller.doid
  }

  public getDOID(address: Address) {
    return controller.getDOID(address)
  }

  public getDOIDAddress(name: string) {
    return controller.getDOIDAddress(name)
  }

  public getWalletClient(chainId?: number): Promise<WalletClient> {
    return controller.getWalletClient(chainId)
  }

  public updateOptions = updateOptions
  public updateChains = updateChains

  public async connect({
    chainId,
    noModal
  }: {
    chainId?: Chain['id']
    noModal?: boolean
  } = {}): Promise<ConnectorData> {
    if (noModal) return controller.connect({ chainId })

    return new Promise<Required<ConnectorData>>(async (resolve, reject) => {
      await Promise.all([import('./connectDialog')])
      const modal = document.createElement('doid-connect-dialog') as DOIDConnectDialog
      modal.chainId = chainId
      document.body.insertAdjacentElement('beforeend', modal)
      modal.on('connect', (ret: any) => resolve(ret))
      modal.on('error', (err: any) => reject(err))
    })
  }
}
