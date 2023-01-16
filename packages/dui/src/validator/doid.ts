import { TAILWINDELEMENT, Ref } from '../shared/TailwindElement'
import { createRef } from 'lit/directives/ref.js'
import DOIDParser from '@lit-web3/ethers/src/DOIDParser'

// Validate DOID format, eg. vincent.doid/The Starry Night#3-1
export const validateDOID = function (this: any, opts = {}) {
  return (this.validateDOID = async (e: CustomEvent): Promise<CheckedName> => {
    const inputVal = e.detail ?? e
    this.DOID = {}
    const parser = await DOIDParser(inputVal)
    const { parsed } = parser
    const { error, msg } = parsed
    if (error) return { error, msg }
    this.DOID = parser.parsed
    return parser.parsed
  })
}
export const ValidateDOID = <T extends PublicConstructor<TAILWINDELEMENT>>(superClass: T, opts = {}) => {
  return class extends superClass {
    validateDOID = validateDOID.bind(this, opts)()
    DOID = {}
    input$: Ref<HTMLInputElement> = createRef()
  } as PublicConstructor<ValidateDOIDInterface> & T
}
