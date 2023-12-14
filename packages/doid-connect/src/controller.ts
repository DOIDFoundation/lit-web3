import { Connector, ConnectorData, InjectedConnector, WalletClient } from '@wagmi/core'
import { options } from './options'
import { State, property } from '@lit-app/state'

export class Controller extends State {
  @property() private connector?: Connector
  @property() private connectedConnector?: Connector

  get connected(): boolean {
    return Boolean(this.connectedConnector)
  }

  public getWalletClient(chainId?: number): Promise<WalletClient> {
    if (!this.connectedConnector) throw new Error('Not connected')
    return this.connectedConnector.getWalletClient({ chainId })
  }

  public connect(): Promise<Required<ConnectorData>> {
    if (!this.connector) this.connector = new InjectedConnector({ chains: options.chains })
    let connector = this.connector
    return connector.connect().then((ret) => {
      this.connectedConnector = connector
      return ret
    })
  }

  public setConnector(connector: Connector) {
    this.connector = connector
  }
}

export const controller = new Controller()
