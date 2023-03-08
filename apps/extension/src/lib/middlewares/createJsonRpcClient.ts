import { createAsyncMiddleware, mergeMiddleware } from 'json-rpc-engine'
import {
  createFetchMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockCacheMiddleware,
  createInflightCacheMiddleware,
  createBlockTrackerInspectorMiddleware
} from '@metamask/eth-json-rpc-middleware'
import { providerFromMiddleware } from '@metamask/eth-json-rpc-provider'
import { PollingBlockTracker } from 'eth-block-tracker'
import { SECOND } from '@lit-web3/core/src/constants/time'

interface createJsonRpcClientOpts {
  rpcUrl: string
  chainId: number
}
export default function createJsonRpcClient({ rpcUrl, chainId } = <createJsonRpcClientOpts>{}) {
  const blockTrackerOpts = process.env.IN_TEST ? { pollingInterval: SECOND * 60 } : {}
  // @ts-expect-error
  const fetchMiddleware = createFetchMiddleware({ rpcUrl })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new PollingBlockTracker({
    ...blockTrackerOpts,
    provider: blockProvider
  })
  const testMiddlewares = process.env.IN_TEST ? [createEstimateGasDelayTestMiddleware()] : []

  const networkMiddleware = mergeMiddleware([
    ...testMiddlewares,
    createChainIdMiddleware(chainId),
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware
  ])

  return { networkMiddleware, blockTracker }
}

const createChainIdMiddleware = function (chainId: number) {
  return (req, res, next, end) => {
    if (req.method === 'eth_chainId') {
      res.result = chainId
      return end()
    }
    return next()
  }
}

/**
 * For use in tests only.
 * Adds a delay to `eth_estimateGas` calls.
 */
function createEstimateGasDelayTestMiddleware() {
  return createAsyncMiddleware(async (req, _, next) => {
    if (req.method === 'eth_estimateGas') {
      await new Promise((resolve) => setTimeout(resolve, SECOND * 2))
    }
    return next()
  })
}
