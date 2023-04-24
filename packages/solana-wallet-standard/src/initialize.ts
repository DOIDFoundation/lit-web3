import { registerWallet } from './register.js';
import { DOIDWallet } from './wallet.js';
import type { DOIDSolana } from './window.js';

export function initialize(doid: DOIDSolana): void {
    registerWallet(new DOIDWallet(doid));
}
