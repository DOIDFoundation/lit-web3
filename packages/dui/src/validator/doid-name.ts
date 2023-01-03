import { TAILWINDELEMENT } from '../shared/TailwindElement'
import { createRef } from 'lit/directives/ref.js'
import { checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'

// Validate DOID Name
export const validateDOIDName = function (this: any, opts: CheckNameOptions = {}) {
  return (this.validateDOIDName = async (e: CustomEvent): Promise<CheckedName> => {
    this.DOID = {}
    const len = isNaN(this.nameMinLen) ? opts.len : this.nameMinLen
    const checked = await checkDOIDName(e.detail, { ...opts, len })
    const { name = '', address = '', error, msg } = checked
    this.name = opts.allowAddress ? name || address : name
    if (error) return { error, msg }
    if ((opts.allowAddress && address) || name) {
      if (this.input$) this.input$.value.$('input').value = this.name
      else console.warn('Please use ref(this.input$) on inputElement first')
    }
    this.DOID = checked
    return checked
  })
}
// Mixin
export const ValidateDOIDName = <T extends PublicConstructor<TAILWINDELEMENT>>(
  superClass: T,
  opts: CheckNameOptions = {}
) => {
  return class extends superClass {
    validateDOIDName = validateDOIDName.bind(this, opts)()
    DOID = {}
    input$ = createRef()
  } as PublicConstructor<ValidateDOIDNameInterface> & T
}
