import { checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'
export { checkDOIDName }

export const validateDOIDName = function (this: any, opts: CheckNameOptions = {}) {
  if (!this.inputNameRef) console.error('Please ref(this.inputNameRef) first')
  return (this.validateDOIDName = (e: CustomEvent): CheckedName => {
    this._checked = {}
    const len = isNaN(this.nameMinLen) ? opts.len : this.nameMinLen
    const checked = checkDOIDName(e.detail, { ...opts, len })
    const { name = '', address = '', error, msg } = checked
    this.name = opts.allowAddress ? name || address : name
    if (error) return { error, msg }
    if ((opts.allowAddress && address) || name) this.inputNameRef.value.$('input').value = this.name
    this._checked = checked
    return checked
  })
}
