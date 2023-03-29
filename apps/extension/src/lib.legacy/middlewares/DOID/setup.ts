import { getAddress, AddressType } from '~/lib.legacy/phrase'
import { MESSAGE_TYPE } from '~/constants/app'
import { ethErrors } from 'eth-rpc-errors'
import swGlobal from '~/ext.scripts/sw/swGlobal'

const request = async () => {
  await 0
  // mock
  return {
    name: 'abc.doid',
    address: [
      { ETH: { '0x1': '0xb794f5ea0ba39494ce839613fffba74279579268' } },
      { BTC: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy' },
      { APTOS: '0xeeff357ea5c1a4e7bc11b2b17ff2dc2dcca69750bfef1e1ebcaccf8c8018175b' }
    ]
  }
}

const DOIDSetupHandler = async function (
  req: any,
  res: any,
  next: Function,
  end: Function,
  { origin, getDOIDName, getUnlockPromise, hasPermission, requestAccountsPermission } = <any>{}
) {
  //
  try {
    await getUnlockPromise(true)
    res.result = await getDOIDName()
    // res.result = await request()
    end()
  } catch (error) {
    end(error)
  }
}

export const requestDOIDSetup = {
  methodNames: [MESSAGE_TYPE.DOID_SETUP],
  implementation: DOIDSetupHandler,
  hookNames: {
    origin: true,
    getDOIDName: true,
    getUnlockPromise: true
  }
}
export default requestDOIDSetup
