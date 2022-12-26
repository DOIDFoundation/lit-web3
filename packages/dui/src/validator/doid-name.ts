import { checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'
export { checkDOIDName }

export const validateDOIDName = function (this: any, { allowAddress = false } = {}) {
  if (!this.inputNameRef) console.error('Please ref(this.inputNameRef) first')
  return (this.validateDOIDName = (e: CustomEvent) => {
    const req: any = { allowAddress }
    if (!isNaN(this.nameMinLen)) req.len = +this.nameMinLen
    const checked = checkDOIDName(e.detail, req)
    const { name = '', address = '', error, msg } = checked
    this.name = allowAddress ? name || address : name
    if (error) return { error, msg }
    this.inputNameRef.value.$('input').value = this.name
    return checked
  })
}
