import { updateChains, updateOptions } from './options'
import { controller } from './controller'
import { Address, Chain, ConnectorData, WalletClient } from '@wagmi/core'
import { DOIDConnectDialog } from './connectDialog'
import { State, StateController } from '@lit-app/state'
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

  /**
   * Bind state changes to a reactive host.
   * @returns A {@link StateController}
   */
  public bindState(host: ReactiveControllerHost) {
    return new StateController(host, controller)
  }

  /**
   * Subscribe state changes.
   * @param callback `(key: string, value: any, state: State) => void`
   * @param nameOrNames key name, can be one or array of following
   *    * `connector`: connector change, value: {@wagmi/core#Connector}
   *    * `addresses`: accounts accessible change, value: {Address[]}
   *    * `account`: account change, value: {Address}
   *    * `chainId`: network change, value: {number}
   *    * `doid`: doid change, value: {string}
   * @see {@link State.subscribe}
   */
  public subscribe = controller.subscribe.bind(controller)

  /** A list of addresses accessible */
  get addresses(): Address[] | undefined {
    // try get addresses for the first time
    if (!controller.addresses) controller.getAddresses()
    return controller.addresses
  }

  /** A promise to get list of addresses accessible */
  public getAddresses(): Promise<Address[]> {
    return controller.getAddresses()
  }

  /** Check if connected with user selected connector. */
  get ready(): boolean {
    // try get a connector for the first time
    if (!controller.ready) controller.getConnector()
    return controller.ready
  }

  /** Check if connected with a valid DOID. */
  get connected(): boolean {
    return controller.connected
  }

  /** Get chain id of connected connector. */
  get chainId() {
    // try get chainId for the first time
    if (!controller.ready) controller.getConnector()
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
  public getWalletClient(chainId?: number): Promise<WalletClient> {
    return controller.getWalletClient(chainId)
  }

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
      modal.on('close', () => reject(new Error('User rejected the request.')))
    })
  }
}
