// TODO: this is mock data, replace with keyring
const mockDef = (): NameInfo[] => {
  return [
    {
      name: 'testabs.doid',
      owner: '0xcd87b53363031a4411c2c2bca41f77bde02ff87d',
      mainAddress: '0xcd87b53363031a4411c2c2bca41f77bde02ff87d'
    },
    {
      name: 'testbds.doid',
      owner: '0xc32B5B624eb24A38708f3872FA2d3e72eFB33Ab7',
      mainAddress: '0xc32B5B624eb24A38708f3872FA2d3e72eFB33Ab7'
    }
  ]
}

let vault = null
let curIdx = 0

export const getAccounts = () => {
  if (!vault) vault = mockDef()
  return vault
}
export const getAccountIdx = () => curIdx
export const getAccount = (idx?: number) => getAccounts()[idx ?? curIdx]
export const setAccountIdx = (idx: number) => (curIdx = idx)
