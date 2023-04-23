// import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
// import { goto } from '@lit-web3/dui/src/shared/router'
// import { keyringStore } from '~/store/keyringState'
// import { getAddress, AddressType } from '~/lib.next/keyring/phrase'
// import { StateController, walletStore } from '~/store'
// import { accountStore } from '~/store/account'

// // Components
// import '@lit-web3/dui/src/input/text'
// import '@lit-web3/dui/src/button'
// import '~/components/pwd-equal'

// import style from './import4th.css?inline'
// @customElement('import-4th')
// export class ViewImport extends TailwindElement(style) {
//   state = new StateController(this, walletStore)
//   bindStore: any = new StateController(this, keyringStore)
//   bindAccount: any = new StateController(this, accountStore)
//   @property() placeholder = ''
//   @state() secretRecoveryPhrase = ''
//   @state() err = ''
//   @state() pwd = ''
//   @state() pending = false

//   onPwdChange = (e: CustomEvent) => {
//     const { pwd, error } = e.detail
//     this.pwd = pwd
//   }

//   get account() {
//     return accountStore.account
//   }

//   routeGoto = (path: string) => {
//     goto(`${path}`)
//   }

//   onCreateMainAddress = async () => {
//     try {
//       console.log(this.account.name, keyringStore.mnemonic, this.pwd, '----------')
//       let ethAddress = await getAddress(keyringStore.mnemonic, AddressType.eth)
//       console.log('mainAddress:', ethAddress, '------------')
//       const encodedSeedPhrase = Array.from(Buffer.from(keyringStore.mnemonic, 'utf8').values())
//       await walletStore.createNewVaultAndRestore(this.account.name, this.pwd, encodedSeedPhrase)
//       goto('/main')
//     } catch (err: any) {
//       console.error(err)
//     }
//   }
//   render() {
//     return html`<div class="home">
//       <div class="dui-container sparse">
//         <div class="dui-container sparse">
//           <doid-symbol sm class="block mt-12">
//             <span slot="h1" class="text-base">Create password for ${this.account.name}</span>
//           </doid-symbol>
//           <div class="max-w-xs mx-auto">
//             <span slot="h1" class="text-sm"
//               >This password will unlock your DOID name(s) only on this device. DOID can not recover this
//               password.</span
//             >

//             <pwd-equal class="mt-8" @change=${this.onPwdChange} @submit=${this.onCreateMainAddress}></pwd-equal>

//             <div class="mt-4 flex justify-between">
//           <dui-button @click=${() =>
//             this.routeGoto('/import3rd')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
//             ><i class="mdi mdi-arrow-left text-gray-500"></i></dui-button>
//           <dui-button @click=${
//             this.onCreateMainAddress
//           } class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
//         </div>

//           </div>

//         </div>
//       </div>
//     </div>`
//   }
// }
