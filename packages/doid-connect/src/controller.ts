import { Connector, ConnectorData, InjectedConnector, WalletClient } from '@wagmi/core'
import { options } from './options'
import { State, property } from '@lit-app/state'

export class Controller extends State {
  @property() private connector?: Connector
  @property() private state?: ConnectorData

  get connected(): boolean {
    return Boolean(this.connector)
  }

  get account() {
    return this.state?.account
  }

  get chainId() {
    return this.state?.chain?.id
  }

  public getWalletClient(chainId?: number): Promise<WalletClient> {
    if (!this.connector) throw new Error('Not connected')
    return this.connector.getWalletClient({ chainId })
  }

  public connect(connector?: Connector): Promise<Required<ConnectorData>> {
    if (!connector) {
      connector = new InjectedConnector({ chains: options.chains })
    }
    connector.once('connect', (data: ConnectorData) => {
      this.connector = connector
      this.state = data
    })
    connector.once('disconnect', () => {
      this.connector = undefined
    })
    connector.on('change', (data: ConnectorData) => {
      this.state = data
    })
    return connector.connect().then((data: Required<ConnectorData>) => {
      this.connector = connector
      this.state = data
      return data
    })
  }
}

export const controller = new Controller()
