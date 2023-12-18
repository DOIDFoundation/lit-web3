import { Wallet, keccak256, hexlify, toUtf8Bytes } from 'ethers'
import { createKeyPair, sign } from '@erebos/secp256k1'
import jsonRpcRequest from '@doid/core/src/http/jsonRpcRequest'
import { defaultNetwork } from '@lit-web3/doids/src/networks'
import { bareTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { getEVMProvider } from '~/services/EVM/daemon'
import { networkStorage } from './background/storage/preferences'

import type { HDNodeWallet } from 'ethers'

const rpcApi = defaultNetwork.provider
const hexWithout0x = (hex: string) => {
  return hex.replace(/0x/g, '')
}

export const rpcRegistName = async (doid: string, account: string, phrase: string) => {
  const preferNet = await networkStorage.get('doid')
  if (!doid || !account || !phrase) return
  const chainId= preferNet.id.padStart(+preferNet.id,'0')
  const owner = hexWithout0x(account).toLowerCase()
  const nameHex = hexWithout0x(hexlify(toUtf8Bytes(doid)))

  const txt = `0x${chainId}${nameHex}${owner}`
  const hash = hexWithout0x(keccak256(`${txt}`))
  const wallet = (await getWalletByPhrase(phrase)) as HDNodeWallet
  const msg = customizedSign(hash, wallet?.privateKey) as string
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

const getOwnerByName = async (name: string) => {
  return await jsonRpcRequest(`${rpcApi}`, 'doid_getOwner', [{ DOID: bareTLD(name) }])
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

export const checkName = async (doid: string) => {
  const name = bareTLD(doid)
  let res: NameInfo = { name: '' }
  if (doid) {
    const owner = (await getOwnerByName(doid)) as string
    res = { name, owner, mainAddress: owner, registered: !!owner, available: !owner }
  }
  return res
}
export const checkTx = async (hash: string) => {
  return await jsonRpcRequest(`${rpcApi}`, 'doid_getTransactionByHash', [hash])
}
const customizedSign = (msg: string, p: string): string => {
  if (!msg || !p) return ''
  const pK = p.startsWith('0x') ? hexWithout0x(p) : p
  return hexlify(new Uint8Array(sign(msg, createKeyPair(pK))))
}
