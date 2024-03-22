import { ThemeElement, html, customElement, when, state, classMap } from '@lit-web3/dui/shared/theme-element'
import '@lit-web3/dui/address'
import '@lit-web3/dui/button'
import '@lit-web3/dui/link'
// import { DOIDConnector, updateChains } from '@doid/connect'
import { parseEther, formatEther, Address } from 'viem'
import {
  getChainId,
  readContract,
  reconnect,
  switchChain,
  waitForTransactionReceipt,
  watchAccount,
  writeContract
} from '@wagmi/core'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { abi } from './abi'

const chains = [mainnet, sepolia] as const

// updateChains(chains)

import style from './style.css?inline'
@customElement('app-main')
export class AppMain extends ThemeElement(style) {
  private chainId = import.meta.env.MODE === 'production' ? mainnet.id : sepolia.id
  private contractAddress: Address =
    import.meta.env.MODE === 'production'
      ? '0x00B19F6f60e50544826Eb2EE5DCdC8d9972F358E'
      : '0xA3C8451dD22AB4f62e452A6a17Ab24Df04139809'
  private scanDomain = import.meta.env.MODE === 'production' ? 'etherscan.io' : 'sepolia.etherscan.io'
  private stakeTime = import.meta.env.MODE === 'production' ? 100 * 24 * 3600 : 120
  private stakeTimeString = import.meta.env.MODE === 'production' ? '100 days' : '2 mins'
  // private doidConnector = new DOIDConnector(this)
  @state() error: string = ''
  @state() queued: boolean = false
  @state() queuedAmount: bigint = BigInt(0)
  @state() queuedTimestamp: bigint = BigInt(0)
  @state() account?: Address
  @state() doid? = ''
  @state() staking = false

  get queuedTime() {
    return new Date(Number(this.queuedTimestamp) * 1000).toUTCString()
  }

  private config = defaultWagmiConfig({
    chains,
    projectId: 'f58e1488ccb9f5b7ef6f11ffa1cd8ba1',
    metadata: {
      name: 'DOID Validator Staking',
      description: 'DOID Validator Staking',
      url: 'https://vals.doid.tech', // origin must match your domain & subdomain.
      icons: ['https://doid.tech/logo.svg']
    }
  })
  get wagmiConfig() {
    // return this.doidConnector.wagmiConfig
    return this.config
  }

  private unwatch: any
  connectedCallback(): void {
    super.connectedCallback()
    this.unwatch = watchAccount(this.wagmiConfig, {
      onChange: (data) => {
        console.log('Account changed!', data)
        this.account = data.address
        if (this.account) this.reload()
      }
    })
    reconnect(this.wagmiConfig)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.unwatch()
  }

  async connect() {
    // let result = await this.doidConnector.connect({ chainId: this.chainId })
    // if (!result.account) return
    // this.account = result.account
    // this.doid = result.doid
    const modal = createWeb3Modal({
      wagmiConfig: this.wagmiConfig,
      projectId: 'f58e1488ccb9f5b7ef6f11ffa1cd8ba1'
    })
    modal.open()
  }

  async reload() {
    const chainId = this.chainId
    console.log(chainId)
    try {
      if (getChainId(this.wagmiConfig) != chainId) await switchChain(this.wagmiConfig, { chainId })
      ;[this.queued, this.queuedAmount, this.queuedTimestamp] = await readContract(this.wagmiConfig, {
        chainId,
        address: this.contractAddress,
        abi,
        functionName: 'getQueue',
        args: [this.account!]
      })
      console.log(this.queued, this.queuedAmount, this.queuedTimestamp)
    } catch (e: any) {
      console.error(e)
      this.error = e.details ?? e
    }
  }

  async stake() {
    this.staking = true
    const chainId = this.chainId
    try {
      console.log(chainId)
      if (getChainId(this.wagmiConfig) != chainId) await switchChain(this.wagmiConfig, { chainId })
      let hash = await writeContract(this.wagmiConfig, {
        chainId,
        account: this.account!,
        address: this.contractAddress,
        abi,
        functionName: 'queue',
        args: [BigInt(Math.ceil(Date.now() / 1000 + this.stakeTime))],
        value: parseEther('0.1')
      })
      try {
        await waitForTransactionReceipt(this.wagmiConfig, { chainId, hash })
      } catch (e) {
        if (!(e instanceof TypeError)) throw e
        console.error(e)
        throw 'failed to get transaction receipt, please check on etherscan'
      }
      this.reload()
    } catch (e: any) {
      console.error(e)
      this.error = e.details ?? e
    }
    this.staking = false
  }

  async redeem() {
    this.staking = true
    const chainId = this.chainId
    try {
      let hash = await writeContract(this.wagmiConfig, {
        chainId,
        account: this.account!,
        address: this.contractAddress,
        abi,
        functionName: 'execute'
      })
      try {
        await waitForTransactionReceipt(this.wagmiConfig, { chainId, hash })
      } catch (e) {
        if (!(e instanceof TypeError)) throw e
        console.error(e)
        throw 'failed to get transaction receipt, please check on etherscan'
      }
      this.reload()
    } catch (e: any) {
      console.error(e)
      this.error = e.details ?? e
    }
    this.staking = false
  }

  render() {
    return html`
      ${when(
        !this.account,
        () => html`
          <div class="font-bold">Rules</div>
          <ul>
            <li>1、Staking 0.1 $ETH for 100 days. It can be redeemed at any time after 100 days.</li>
            <li>2、After staking, follow the instructions to complete the node verification.</li>
            <li>3、Check the redemption time on this page.</li>
          </ul>
          <button class="btn connect-btn hoverable mt-4" @click=${() => this.connect()}>Start</button>
        `,
        () => html`
          <div class="text-right mb-4 text-xs">
            ${this.doid}(<dui-address .address=${this.account} short></dui-address>)
          </div>
          <div class="text-xl my-4">Step 1</div>
          <div>
            Contract address:
            <a
              style="text-decoration: underline;"
              href="https://${this.scanDomain}/address/${this.contractAddress}#code"
              target="_blank"
              >${this.contractAddress}</a
            >
            ${when(
              this.queued,
              () =>
                html`<button
                  class="btn stake-btn hoverable ml-2 ${classMap({ disabled: this.staking })}"
                  @click=${() => this.redeem()}
                >
                  Redeem
                </button>`,
              () =>
                html`<button
                  class="btn stake-btn hoverable ml-2 ${classMap({ disabled: this.staking })}"
                  @click=${() => this.stake()}
                >
                  Stake
                </button>`
            )}
          </div>
          ${when(this.error, () => html`<div class="text-red-500">${this.error}</div>`)}
          ${when(
            this.queued,
            () =>
              html`<div>
                Amount of staking: ${formatEther(this.queuedAmount)} ETH<span class="ml-8"
                  >Until: ${this.queuedTime}</span
                ><dui-button icon @click=${() => this.reload()}>
                  <i class="mdi mdi-reload"></i>
                </dui-button>
              </div>`,
            () => html`<div>Amount of staking: 0.1ETH<span class="ml-8">Duration: ${this.stakeTimeString}</span></div>`
          )}
          <div class="text-xl my-4">Step 2</div>
          <div>
            Follow the instructions in
            <a style="text-decoration: underline;" href="https://doc.doid.tech" target="_blank">doc.doid.tech</a> and
            email your Validator's public key and wallet address to validator@doid.tech
          </div>
          <div class="text-xl my-4">Step 3</div>
          <ul>
            <li>
              1. The DOID official technical team will reply to the Validator you created based on the information you
              provided. After receiving the email, please run the Validator.
            </li>
            <li>2. If your Validator can run successfully, your wallet address will receive $DOID rewards.</li>
          </ul>
          <div class="mt-8 mb-4">Join our discord Community, any questions contact admin, at any time.</div>
          <div class="flex flex-row">
            <a class="ico i3" href="https://discord.gg/N9emnzwAzm" target="_blank"></a>
            <a class="ico i7" href="https://doc.doid.tech" target="_blank"></a>
          </div>
        `
      )}
    `
  }
}
