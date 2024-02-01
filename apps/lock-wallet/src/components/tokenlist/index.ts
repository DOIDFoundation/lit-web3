import { customElement, ThemeElement, html, state, repeat, when, classMap } from '@lit-web3/dui/shared/theme-element'
import { bridgeStore, StateController, getNativeBalance, getContract, getBridgeProvider } from '~/ethers/useBridge'
import { formatUnits } from 'ethers'
import { getMultiCallProvider, getMultiCallContract } from '~/ethers/multiCall'
// import ERC20 from '~/ethers/abi/Erc20.json'
import style from './index.css?inline'
import { getList } from './tokens'
import { goto } from '@lit-web3/router'


@customElement('token-list')
export class switchNetwork extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  @state() nativeBalance = '0'
  @state() tokenList: any = []

  get account() {
    return bridgeStore.bridge.account
  }
  get network() {
    return bridgeStore.bridge.network
  }
  get current() {
    return this.network.current
  }
  get native() {
    return this.current?.native
  }

  toSend(item: any) {
    const path = item.contract === 'native' ? '/send' : '/send/' + item.symbol
    goto(path)
  }
  async getNativeBalance() {
    if (this.account) {
      this.nativeBalance = await getNativeBalance(this.account)
    } else {
      this.nativeBalance = '0'
    }
  }
  async getTokensBanlance() {
    this.tokenList = await getList()

    // const provider = await getBridgeProvider()
    // // const { chainId: bridgeChainId } = await provider.getNetwork()
    // const multiCallProvider = await getMultiCallProvider()
    // // const test1 = await new Contract('0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6', ERC20, provider)

    // // console.log(test1, ERC20);

    // const contract1 = await getMultiCallContract('Erc20', { address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6' })
    // const contract2 = await getMultiCallContract('Erc20', { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' })
    // const ban1 = contract1.balanceOf(this.account)
    // const ban2 = contract2['balanceOf'](this.account)
    // const res = await multiCallProvider.all([ban1, ban2])
    // console.log(formatUnits(res[0][0]), 'ban');
    // console.log(res, 'res');

  }
  connectedCallback(): void {
    super.connectedCallback()
    this.getNativeBalance()
    this.getTokensBanlance()
    // console.log(this.network)
  }
  render() {
    return html`
      <div>
        ${this.tokenList.map((item: any) => {
      return html`
          <div class="flex justify-between cursor-pointer mb-2" @click="${() => this.toSend(item)}">
            <div class="flex items-center">
              <div class="rounded-full border p-2 w-12 h-12 flex justify-center items-center">
                <i class="token-icon ${item.symbol}"></i>
              </div>
              <div class="ml-2">
                <div>${item.symbol}</div>
                <div class="text-xs text-gray-400">${item.name}</div>
              </div>
            </div>
            <div class="flex items-center">
              <div>${item.balance}</div>
              <div>
                <i class="mdi mdi-chevron-right"></i>
              </div>
            </div>
            <!-- ${this.native.symbol} -->
          </div>
          `
    })}

      </div>
    `
  }
}
