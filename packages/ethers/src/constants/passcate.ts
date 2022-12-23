// All Contracts
export interface PASSCATE {
  [cate: string]: [string, number]
}

export const PassCate: Record<string, number> = {
  A: 2,
  B: 4,
  C: 6
}

const gen = (cate: string): [string, number] => [cate, PassCate[cate]]

export const PassCates: Record<string, PASSCATE> = {
  '0x1': {
    '0x03783fac2efed8fbc9ad443e592ee30e61d65f471140c10ca155e937b435b760': gen('A'),
    '0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111': gen('B'),
    '0x017e667f4b8c174291d1543c466717566e206df1bfd6f30271055ddafdb18f72': gen('C')
  },
  '0xaa36a7': {
    '0x03783fac2efed8fbc9ad443e592ee30e61d65f471140c10ca155e937b435b760': gen('A'),
    '0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111': gen('B'),
    '0x017e667f4b8c174291d1543c466717566e206df1bfd6f30271055ddafdb18f72': gen('C')
  },
  '0x5': {
    '0x03783fac2efed8fbc9ad443e592ee30e61d65f471140c10ca155e937b435b760': gen('A'),
    '0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111': gen('B'),
    '0x017e667f4b8c174291d1543c466717566e206df1bfd6f30271055ddafdb18f72': gen('C')
  }
}
