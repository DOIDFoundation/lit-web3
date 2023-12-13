import { Connector, InjectedConnector } from '@wagmi/core'

export class Controller {
  private connector?: Connector

  public connect() {
    if (!this.connector) this.connector = new InjectedConnector()
    return this.connector.connect()
  }

  public setConnector(connector: Connector) {
    this.connector = connector
  }
}

export const controller = new Controller()
