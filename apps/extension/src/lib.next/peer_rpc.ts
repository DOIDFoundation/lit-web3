import { Wallet, keccak256, hexlify, toUtf8Bytes } from 'ethers'
import { createKeyPair, sign } from '@erebos/secp256k1'
import jsonRpcRequest from '@lit-web3/core/src/http/jsonRpcRequest'
import { getEVMProvider } from '~/services/EVM/daemon'

import type { HDNodeWallet } from 'ethers'
import { bareTLD } from '@lit-web3/ethers/src/nsResolver/checker'

const rpcApi = import.meta.env.VITE_RPC_API
const hexWithout0x = (hex: string) => {
  return hex.replace(/0x/g, '')
}

export const rpcRegistName = async (doid: string, account: string, phrase: string) => {
  if (!doid || !account || !phrase) return
  const owner = hexWithout0x(account)
  const txt = hexlify(toUtf8Bytes(doid)) + `${owner}`.toLowerCase()
  const hash = hexWithout0x(keccak256(`${txt}`))
  const wallet = (await getWalletByPhrase(phrase)) as HDNodeWallet
  const msg = customizedSign(hash, wallet?.privateKey) as string

  /* // S
  const resSignedMsg = wallet.signingKey.sign(`0x${hash}`).serialized
  // console.log({ msgE: resSignedMsg })
  // E */

  const params = [
    {
      type: 'register',
      data: {
        DOID: doid,
        Owner: owner,
        Signature: hexWithout0x(msg),
        From: owner
      }
    }
  ]
  return await jsonRpcRequest(`${rpcApi}`, 'doid_sendTransaction', params)
}

export const rpcSearch = async (keyword: string): Promise<NameInfo> => {
  let _name = bareTLD(keyword)
  let res: NameInfo = { name: '', registered: false, available: false }

  if (keyword) {
    const owner = (await jsonRpcRequest(`${rpcApi}`, 'doid_getOwner', [{ DOID: _name }])) as string
    res = { name: _name, owner, mainAddress: owner, registered: !!owner, available: !owner }
  }
  return res
}

const getWalletByPhrase = async (phrase: string) => {
  if (!phrase) return
  const provider = await getEVMProvider()
  return Wallet.fromPhrase(phrase, provider)
}

const customizedSign = (msg: string, p: string): string => {
  if (!msg || !p) return ''
  const pK = p.startsWith('0x') ? hexWithout0x(p) : p
  return hexlify(new Uint8Array(sign(msg, createKeyPair(pK))))
}
