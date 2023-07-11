// Inpage Provider
import { initialize } from '@lit-web3/solana-wallet-standard/src'
import { WalletEvent, DOIDSolana } from '@lit-web3/solana-wallet-standard/src/window'
import { PublicKey, Transaction, VersionedTransaction, SendOptions } from '@solana/web3.js'
import inpageMessenger from '~/lib.next/messenger/inpage'
import { EventEmitter } from 'eventemitter3'
import { decodeBase58, encodeBase58, toBeArray } from 'ethers'

class DOIDSolanaProvider implements DOIDSolana {
  emitter: EventEmitter
  publicKey!: PublicKey | null
  constructor() {
    this.emitter = new EventEmitter()
  }
  connect(options?: { onlyIfTrusted?: boolean | undefined } | undefined): Promise<{ publicKey: PublicKey }> {
    return inpageMessenger.send('solana_request', { method: 'connect', options }).then((address) => {
      this.publicKey = new PublicKey(address)
      this.emitter.emit('connect')
      return { publicKey: this.publicKey }
    })
  }
  disconnect(): Promise<void> {
    return inpageMessenger.send('solana_request', { method: 'disconnect' }).then(() => {
      this.publicKey = null
      this.emitter.emit('disconnect')
    })
  }
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions | undefined
  ): Promise<{ signature: string }> {
    if (!this.publicKey) {
      throw new Error('wallet not connected')
    }

    return inpageMessenger.send('solana_request', { method: 'signAndSendTransaction', transaction, options })
  }
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    if (!this.publicKey) {
      throw new Error('wallet not connected')
    }

    return inpageMessenger.send('solana_request', { method: 'signTransaction', transaction })
  }
  signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
    if (!this.publicKey) {
      throw new Error('wallet not connected')
    }

    return inpageMessenger.send('solana_request', { method: 'signAllTransaction', transactions })
  }
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }> {
    if (!this.publicKey) {
      throw new Error('wallet not connected')
    }

    return inpageMessenger
      .send('solana_request', { method: 'signMessage', message: encodeBase58(message) })
      .then((signature) => {
        return { signature: toBeArray(decodeBase58(signature)) }
      })
  }
  on<E extends keyof WalletEvent>(event: E, listener: WalletEvent[E], context?: any): void {
    this.emitter.on(event, listener, context)
  }
  off<E extends keyof WalletEvent>(event: E, listener: WalletEvent[E], context?: any): void {
    this.emitter.off(event, listener, context)
  }
}

export const injectSolanaInpageProvider = () => {
  if (!('DOIDSolana' in window)) {
    const doidSolana = new DOIDSolanaProvider()
    initialize(doidSolana)
    // Attach the reference to the window, guarding against errors.
    try {
      Object.defineProperty(window, 'DOIDSolana', { value: doidSolana })
    } catch (error) {
      console.error(error)
    }
  }
}
