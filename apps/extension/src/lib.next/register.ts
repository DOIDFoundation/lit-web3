import { Wallet, keccak256, hexlify, toUtf8Bytes } from 'ethers'
import { createKeyPair, sign } from '@erebos/secp256k1'
import jsonRpcRequest from '@lit-web3/core/src/http/jsonRpcRequest'
import { getEVMProvider } from '~/services/EVM/daemon'

import type { HDNodeWallet } from 'ethers'

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
  console.log({ msg })

  // S
  const resSignedMsg = wallet.signingKey.sign(`0x${hash}`).serialized
  console.log({ msgE: resSignedMsg })
  // E

  const params = [
    {
      DOID: doid,
      Owner: owner, // to
      Signature: hexWithout0x(msg),
      From: owner //sign
    }
  ]
  return await jsonRpcRequest(`${rpcApi}`, 'doid_sendTransaction', params)
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
