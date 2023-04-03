import { KeyringController, keyringBuilderFactory } from '@metamask/eth-keyring-controller'
import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'

// const keyringController = new KeyringController({
//   keyringBuilders: additionalKeyrings,
//   initState: initState.KeyringController,
//   encryptor: opts.encryptor || undefined,
//   cacheEncryptionKey: isManifestV3,
// });
// console.log(KeyringController)

class Store extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: [] }) names!: NameInfo[]
  @property({ value: 0 }) ts!: number
  @property() mnemonic!: string
}

export const keyringStore = new Store()
