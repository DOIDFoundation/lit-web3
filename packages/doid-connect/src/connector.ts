import { updateChains, updateOptions } from './options'
import { controller } from './controller'
import { Address, Chain, ConnectorData, WalletClient } from '@wagmi/core'
import { DOIDConnectDialog } from './connectDialog'
import { StateController } from '@lit-app/state'
import { ReactiveControllerHost } from 'lit'

export class DOIDConnector {
  constructor(host?: ReactiveControllerHost) {
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

  public getDOID = controller.getDOID.bind(controller)
  public getDOIDAddress = controller.getDOIDAddress.bind(controller)
  public getWalletClient = controller.getWalletClient.bind(controller)
  public updateOptions = updateOptions
  public updateChains = updateChains
  public disconnect = controller.disconnect.bind(controller)
  public switchChain = controller.switchChain.bind(controller)

  public async connect({
    chainId,
    noModal
  }: {
    chainId?: Chain['id']
    noModal?: boolean
  } = {}): Promise<ConnectorData> {
    if (noModal) return controller.connect({ chainId })

    return new Promise<ConnectorData>(async (resolve, reject) => {
      await Promise.all([import('./connectDialog')])
      const modal = document.createElement('doid-connect-dialog') as DOIDConnectDialog
      modal.chainId = chainId
      document.body.insertAdjacentElement('beforeend', modal)
      modal.on('connect', (event) => resolve(event.detail))
      modal.on('error', (event) => reject(event.detail))
    })
  }
}
