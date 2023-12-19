import { updateChains, updateOptions } from './options'
import { controller } from './controller'
import { Chain, ConnectorData, WalletClient } from '@wagmi/core'
import { DOIDConnectDialog } from './connectDialog'
import { StateController } from '@lit-app/state'
import { ReactiveControllerHost } from 'lit'

export { type WalletClient } from '@wagmi/core'

export class DOIDConnector {
  /**
   * Construct a connector and bind reactive host on demand.
   * @param host A {@link ReactiveControllerHost} to bind
   */
  constructor(host?: ReactiveControllerHost) {
    if (host) this.bindState(host)
  }

  public bindState(host: ReactiveControllerHost) {
    return new StateController(host, controller)
  }

  /** Check if connected with user selected connector. */
  get walletConnected(): boolean {
    return controller.walletConnected
  }

  /** Check if connected with a valid DOID. */
  get connected(): boolean {
    return controller.connected
  }

  /** Get chain id of connected connector. */
  get chainId() {
    return controller.chainId
  }

  /** Get DOID name of connected account. */
  get doid() {
    return controller.doid
  }

  /** Get account from connected connector. */
  get account() {
    return controller.account
  }

  /** Get DOID name by address. */
  public getDOID = controller.getDOID.bind(controller)
  /** Get address by DOID name. */
  public getDOIDAddress = controller.getDOIDAddress.bind(controller)
  /** Get a {@link WalletClient} object from connector. Useful for sending transactions. */
  public getWalletClient = controller.getWalletClient.bind(controller)

  public updateOptions = updateOptions
  public updateChains = updateChains
  public disconnect = controller.disconnect.bind(controller)
  public switchChain = controller.switchChain.bind(controller)
  /**
   * Subscribe state change.
   * @param callback `(key: string, value: any, state: State) => void`
   * @param nameOrNames key name, can be `connector`: connector changed, `connectorState`: account or network changed
   */
  public subscribe = controller.subscribe.bind(controller)

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
      modal.on('close', () => reject(new Error('User rejected the request.')))
    })
  }
}
