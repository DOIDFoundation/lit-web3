import { formatsByName, formatsByCoinType } from '../address-encoder'

export const chk = () => {
  const data = formatsByName['BTC'].decoder('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
  console.log(data.toString('hex'))
  const addr = formatsByCoinType[0].encoder(data)
  console.log(addr)
}
