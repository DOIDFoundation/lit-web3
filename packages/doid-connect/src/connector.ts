import { ConfigOptions, options, updateChains, updateChainId, updateOptions } from './options'
import { controller } from './controller'
import { Address, Chain, ConnectorData, WalletClient } from '@wagmi/core'
import { DOIDConnectDialog } from './connectDialog'
import { State, StateController } from '@lit-app/state'
import { ReactiveControllerHost } from 'lit'
import emitter from '@lit-web3/base/emitter'

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
    if (!controller.ready) controller.getChainId()
    return controller.chainId
  }

  /** A promise to get chainId. */
  public getChainId() {
    return controller.getChainId()
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

  public updateOptions(opts: ConfigOptions) {
    const doidChainId = options.doidNetwork?.id
    updateOptions(opts)
    if (doidChainId != opts.doidNetwork?.id) controller.updateDoidClient()
  }
  public updateChainId = (chainId: number) => {
    updateChainId(chainId)
    if (options.doidNetwork?.id != chainId) controller.updateDoidClient()
  }

  public updateChains = updateChains
  public disconnect = controller.disconnect.bind(controller)
  public switchChain = controller.switchChain.bind(controller)

  public connect = async ({
    chainId,
    noModal
  }: {
    chainId?: Chain['id']
    noModal?: boolean
  } = {}): Promise<ConnectorData> => {
    // Require signup
    emitter.on('doid-connect-nosignup', (e: CustomEvent) => {
      if (!this.#getDialog() && controller.getConnector()) this.showDialog(chainId, 'signup')
    })
    if (noModal) return controller.connect({ chainId })

    return new Promise<ConnectorData>(async (resolve, reject) => {
      const modal = await this.showDialog(chainId)
      modal.on('connect', (event: CustomEvent) => resolve(event.detail))
      modal.on('error', (event: CustomEvent) => reject(event.detail))
      modal.on('close', () => reject(new Error('User rejected the request.')))
    })
  }

  #tag = 'doid-connect-dialog'
  #getDialog = (): DOIDConnectDialog | null => document.querySelector(this.#tag)
  showDialog = async (chainId?: Chain['id'], scene = ''): Promise<DOIDConnectDialog> => {
    let modal = this.#getDialog()
    if (!modal) await import('./connectDialog')
    if (!(modal = this.#getDialog())) {
      modal = document.createElement(this.#tag) as DOIDConnectDialog
      document.body.insertAdjacentElement('beforeend', modal)
    }
    modal.chainId = chainId
    modal.scene = scene
    return modal
  }
}
