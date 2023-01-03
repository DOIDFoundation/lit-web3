import { TAILWINDELEMENT } from '../shared/TailwindElement'
import { createRef } from 'lit/directives/ref.js'
import DOIDNameParser from '@lit-web3/ethers/src/nameParser'

// Validate DOID format, eg. vincent.doid/The Starry Night#3-1
export const validateDOID = function (this: any, opts = {}) {
  return (this.validateDOID = async (e: CustomEvent): Promise<CheckedName> => {
    const inputVal = e.detail
    this.DOID = {}
    const parser = await DOIDNameParser(inputVal)
    const { parsed } = parser
    const { val, error, msg } = parsed
    const valWithIdentifier = parser.stringify({ keepIdentifier: true })
    if (error) return { error, msg }
    if (val && inputVal !== valWithIdentifier) {
      if (this.input$) this.input$.value.$('input').value = val
      else console.warn('Please use ref(this.input$) on inputElement first')
    }
    this.DOID = parser.parsed
    return parser.parsed
  })
}
export const ValidateDOID = <T extends PublicConstructor<TAILWINDELEMENT>>(superClass: T, opts = {}) => {
  return class extends superClass {
    validateDOID = validateDOID.bind(this, opts)()
    DOID = {}
    input$ = createRef()
  } as PublicConstructor<ValidateDOIDInterface> & T
}
