import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  choose,
  when
  // until
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { Wallet } from 'ethers'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '~/components/phrase'
import '~/components/pwd-equal'

import style from './create.css?inline'
import { AddressType, phraseToAddress } from '~/lib.next/keyring/phrase'
import {
  // assignOverrides,
  // getABI,
  // getBridgeProvider,
  // getContracts,
  getNativeBalance,
  getNetwork
} from '@lit-web3/ethers/src/useBridge'
// import { now } from '@lit-web3/ethers/src/nsResolver/registrar'
import { bareTLD, wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// import { txReceipt } from '@lit-web3/ethers/src/txReceipt'
import popupMessenger from '~/lib.next/messenger/popup'
import { MultiChainAddresses } from '~/lib.next/keyring/phrase'
// import ipfsHelper from '~/lib.next/ipfsHelper'
import { rpcRegistName } from '~/lib.next/peer_rpc'

enum Steps {
  EnterPhrase,
  EnterPassword,
  CheckBalance,
  WaitTX,
  Error,
  Success
}

@customElement('view-create')
export class ViewHome extends TailwindElement(style) {
  @property() doid = ''
  @state() pending = false
  @state() btnNextDisabled = true
  @state() err = ''
  @state() phrase = ''
  @state() pwd = ''
  @state() address = ''
  @state() balance = ''
  @state() transaction: any = null
  @state() step: Steps = Steps.EnterPhrase
  @state() timer: NodeJS.Timeout | null = null

  get wrapName() {
    return wrapTLD(this.doid)
  }

  get insufficientBalance() {
    return this.balance == '' || parseFloat(this.balance) == 0
  }

  onPhraseChange = async (e: CustomEvent) => {
    e.stopPropagation()
    this.btnNextDisabled = true
    const { phrase, error } = e.detail as any
    if (error) return

    this.phrase = phrase
    this.btnNextDisabled = false
  }

  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
    this.btnNextDisabled = error
  }

  onConfirmPhrase = async () => {
    let address = await phraseToAddress(this.phrase, AddressType.eth)
    if (!address || typeof address != 'string' || !this.doid) return
    this.address = address
    this.balance = ''
    if (await popupMessenger.send('internal_isinitialized')) {
      this.stepTo(Steps.CheckBalance)
      this.checkBalance()
    } else this.next()
  }

  onConfirmCreation = async () => {
    this.balance = ''
    this.next()
    this.checkBalance()
  }

  checkBalance = async () => {
    if (this.timer) clearTimeout(this.timer)
    getNativeBalance(this.address).then((balance) => {
      this.balance = balance
      this.timer = setTimeout(this.checkBalance, 3000)
    })
  }

  onCreate = async () => {
    this.next()
    try {
      let addresses = (await phraseToAddress(this.phrase)) as MultiChainAddresses
      let wallet = Wallet.fromPhrase(this.phrase)
      let mainAddress = await wallet.getAddress()
      if (mainAddress.toLowerCase() != addresses[AddressType.eth].toLowerCase())
        throw new Error('Internal Error: Addresses generated differs')

      // const name = await ipfsHelper._getIPNSNameFromStorage(this.phrase)
      // register doid
      /* let contract = new Contract(
        await getContracts('Resolver'),
        await getABI('Resolver'),
        wallet.connect(await getBridgeProvider())
      )
      const [method, overrides] = ['register(string,address,bytes)', {}]
      const parameters = [bareTLD(this.wrapName), mainAddress, name.bytes]
      await assignOverrides(overrides, contract, method, parameters)
      const call = contract[method](...parameters)
      this.transaction = new txReceipt(call, {
        errorCodes: 'Resolver',
        seq: {
          type: 'register',
          title: 'Register',
          ts: now(),
          overrides
        }
      })
      await this.transaction.wait() */

      await rpcRegistName(bareTLD(this.doid), this.address, this.mnemonic)

      // add to extension
      await popupMessenger.send('internal_recovery', {
        doid: this.wrapName,
        json: { addresses },
        pwd: this.pwd,
        phrase: this.phrase
      })
      this.stepTo(Steps.Success)
    } catch (error: any) {
      console.error(error)
      this.err = error
      this.stepTo(Steps.Error)
    }
  }

  next() {
    this.stepTo(this.step + 1)
  }

  back() {
    if (this.step == Steps.EnterPhrase) history.back()
    else this.stepTo(this.step - 1)
  }

  stepTo(step: Steps) {
    this.step = step
    this.btnNextDisabled = true
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  render() {
    return html`<div class="create">
      <div class="dui-container sparse">
        ${choose(
          this.step,
          [
            [
              Steps.EnterPhrase,
              () => html`<doid-symbol sm class="block mt-12"> </doid-symbol>
                <div class="my-4 text-xs">
                  You are trying to create
                  <dui-link class="uri ml-1 underline">${this.wrapName}</dui-link>
                </div>
                <div class="my-4 text-xs">Enter your Secret Recovery Phrase</div>
                <phrase-to-secret class="my-4" @change=${this.onPhraseChange}></phrase-to-secret>
                <div class="my-4 text-xs">
                  This Secret Recovery Phrase will be used to create your DOID name and generate Main Addresses.
                </div>
                <div class="my-2 text-center">or</div>
                <dui-button text class="w-full my-2" @click=${() => goto(`/generate-phrase`)}
                  >Generate a Secret Recovery Phrase</dui-button
                >
                <div class="mt-4 flex justify-between">
                  <dui-button @click=${this.back} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
                    ><i class="mdi mdi-arrow-left text-gray-500"></i
                  ></dui-button>
                  <dui-button
                    ?disabled=${this.btnNextDisabled}
                    @click=${this.onConfirmPhrase}
                    class="secondary !rounded-full h-12 w-12"
                    ><i class="mdi mdi-arrow-right"></i
                  ></dui-button>
                </div> `
            ],
            [
              Steps.EnterPassword,
              () => html`<doid-symbol class="block mt-12">
                  <span slot="h1" class="text-base">Create password</span>
                </doid-symbol>
                <div class="my-4 text-xs">
                  This password will unlock your DOID name(s) only on this device. DOID can not recover this password.
                </div>
                <pwd-equal class="mt-8" @change=${this.onPwdChange} @submit=${this.onConfirmCreation}></pwd-equal>
                <div class="mt-4 flex justify-between">
                  <dui-button @click=${this.back} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
                    ><i class="mdi mdi-arrow-left text-gray-500"></i
                  ></dui-button>
                  <dui-button
                    ?disabled=${this.btnNextDisabled}
                    @click=${this.onConfirmCreation}
                    class="secondary !rounded-full h-12 w-12"
                    ><i class="mdi mdi-arrow-right"></i
                  ></dui-button>
                </div> `
            ],
            [
              Steps.CheckBalance,
              () => html`<doid-symbol class="block mt-12"> </doid-symbol>
                <div class="my-4 text-sm">
                  You are trying to create
                  <dui-link class="uri ml-1 underline">${this.wrapName}</dui-link>
                </div>
                <div class="my-4 text-sm">
                  With ETH account
                  ${this.address}(${when(
                    this.balance,
                    () => html`${this.balance} ETH`,
                    () => html`<i class="mdi mdi-loading"></i>`
                  )})
                </div>
                <dui-button sm ?disabled=${this.insufficientBalance} class="my-2" @click=${this.onCreate}
                  >${choose(
                    this.balance,
                    [
                      ['', () => html`Checking balance <i class="mdi mdi-loading"></i>`],
                      ['0.0', () => html`Insufficient balance`]
                    ],
                    () => html`Create`
                  )}</dui-button
                >
                <div class="my-4 text-xs">
                  ${when(
                    this.insufficientBalance,
                    () => html`A small amount of ETH is needed to pay gas. You can transfer some ETH to this account
                    above and start creation.`,
                    () => html`A small amount of ETH will be used to pay gas.`
                  )}
                </div>
                <div class="my-2 text-center">or</div>
                <dui-button text class="w-full my-2" @click=${() => this.stepTo(Steps.EnterPhrase)}
                  >Use other Secret Recovery Phrase</dui-button
                >`
            ],
            [
              Steps.WaitTX,
              () => html`<doid-symbol class="block mt-12"> </doid-symbol>
                <div class="my-4 text-sm">
                  You are creating
                  <dui-link class="uri ml-1 underline">${this.wrapName}</dui-link>
                </div>
                <div class="my-4 text-sm">With ETH account ${this.address}(${this.balance} ETH)</div>
                <i class="mdi mdi-loading"></i>
                ${when(
                  this.transaction?.hash,
                  () => html`<div class="my-4 text-sm">Waiting for transaction confirmation...</div>
                    <div class="my-4 text-sm">
                      View transaction:<dui-link
                        class="link ml-1 underline"
                        href="${async () => (await getNetwork()).scan}/tx/${this.transaction?.hash}"
                        >${this.transaction?.hash} <i class="mdi mdi-open-in-new"></i
                      ></dui-link>
                    </div>`
                )}`
            ],
            [
              Steps.Error,
              () => html`<doid-symbol class="block mt-12"> </doid-symbol>
                <div class="my-4 text-sm">
                  Failed to create
                  <dui-link class="uri ml-1 underline">${this.wrapName}</dui-link>
                </div>
                <div class="my-4 text-sm">With ETH account ${this.address}(${this.balance} ETH)</div>
                <div class="my-4 text-sm"><span class="text-red-500">${this.err}</span></div>
                ${when(
                  this.transaction?.hash,
                  () => html`<div class="my-4 text-sm">
                    View transaction:<dui-link
                      class="link ml-1 underline"
                      href="${async () => (await getNetwork()).scan}/tx/${this.transaction?.hash}"
                      >${this.transaction?.hash} <i class="mdi mdi-open-in-new"></i
                    ></dui-link>
                  </div>`
                )}
                <div class="mt-4 flex justify-between">
                  <dui-button
                    @click=${() => this.stepTo(Steps.CheckBalance)}
                    class="!rounded-full h-12 outlined w-12 !border-gray-500 "
                    ><i class="mdi mdi-arrow-left text-gray-500"></i
                  ></dui-button>
                  <dui-button disabled class="secondary !rounded-full h-12 w-12"
                    ><i class="mdi mdi-arrow-right"></i
                  ></dui-button>
                </div> `
            ]
          ],
          () =>
            html` <doid-symbol class="block mt-12">
                <span slot="h1" class="text-base">DOID creation successful</span>
              </doid-symbol>
              <div class="text-center text-sm">You've successfully created your DOID name.</div>
              <div class="text-sm text-center">
                Keep your Secret Recovery Phrase safe and secret -- it's your responsibility!
              </div>
              <div class="text-sm text-center my-2">Remember:</div>
              <div class="text-sm text-left my-2">
                <ul>
                  <li>DOID can't recover your Secret Recovery Phrase.</li>
                  <li>DOID will never ask you for your Secret Recovery Phrase.</li>
                  <li>Never share your Secret Recovery Phrase with anyone or risk your funds being stolen</li>
                </ul>
              </div>
              <div class="mt-2 text-center">
                <dui-button @click=${() => goto('/main')} class="secondary h-30 w-30">GOT IT</dui-button>
              </div>`
        )}
      </div>
    </div>`
  }
}
