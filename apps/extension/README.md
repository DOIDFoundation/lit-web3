# DOID Extension

## MultiChain API

### DOID

| Method             | Description         |
| ------------------ | ------------------- |
| DOID_name          | ✅                  |
| DOID_requestName   | ✅                  |
| DOID_setup         | ✅                  |
| DOID_chain_address | Not implemented yet |

### Ethereum

| Method                     | Description         |
| -------------------------- | ------------------- |
| eth_chainId                | ✅                  |
| eth_blockNumber            | ✅                  |
| eth_accounts               | ✅                  |
| eth_requestAccounts        | ✅                  |
| eth_getBalance             | ✅                  |
| personal_sign              | ✅                  |
| wallet_switchEthereumChain | ✅                  |
| wallet_addEthereumChain    | Not implemented yet |
| signTransaction            | Not implemented yet |

| Events          | Description         |
| --------------- | ------------------- |
| accountsChanged | ✅                  |
| chainChanged    | ✅                  |
| message         | Not implemented yet |
| connect         | Not implemented yet |
| disconnect      | Not implemented yet |

### Solana

| Method                 | Description         |
| ---------------------- | ------------------- |
| connect                | ✅                  |
| signMessage            | ✅                  |
| disconnect             | Not implemented yet |
| signTransaction        | Not implemented yet |
| signTransaction        | Not implemented yet |
| signAndSendTransaction | Not implemented yet |
| signAllTransaction     | Not implemented yet |

### Aptos

| Method      | Description         |
| ----------- | ------------------- |
| connect     | ✅                  |
| signMessage | ✅                  |
| disconnect  | Not implemented yet |
| isConnected | Not implemented yet |
| getAccount  | Not implemented yet |
| network     | Not implemented yet |

## Development locally

- Install & Run: `pnpm i && pnpm --filter @lit-web3/extension dev`
- Load unpacked folder `/dist` then copy your extension ID
- Preview: [chrome-extension://jmhdoibclehmjkabmelefdhdbmphjell](chrome-extension://jmhdoibclehmjkabmelefdhdbmphjell) (replace with your extension id)
