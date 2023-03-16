import pump from 'pump'
import { storeAsStream } from '~/lib/obs-store'
// import debounce from 'debounce-stream'
import swGlobal from '~/ext.scripts/sw/swGlobal'
import createStreamSink from '~/lib/keyringController.setup/createStreamSink'
import { sleep } from '@lit-web3/ethers/src/utils'

export default async function setupPump() {
  const { controller } = swGlobal
  pump(
    storeAsStream(controller?.store),
    // debounce(1000),
    createStreamSink((state: any) => swGlobal.localStore.set(state)),
    (error) => {
      console.warn('DOID - Persistence pipeline failed', error)
    }
  )
}
