import getFetchWithTimeout from './fetchWithTimeout'

const fetchWithTimeout = getFetchWithTimeout()

export async function jsonRpcRequest(
  rpcUrl: string,
  rpcMethod: string,
  rpcParams: unknown[] = []
): Promise<unknown | undefined> {
  let fetchUrl = rpcUrl
  const headers: Record<string, any> = {
    'Content-Type': 'application/json'
  }
  // Convert basic auth URL component to Authorization header
  const { origin, pathname, username, password, search } = new URL(rpcUrl)
  // URLs containing username and password needs special processing
  if (username && password) {
    const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64')
    headers.Authorization = `Basic ${encodedAuth}`
    fetchUrl = `${origin}${pathname}${search}`
  }
  const jsonRpcResponse = await fetchWithTimeout(fetchUrl, {
    method: 'POST',
    body: JSON.stringify({
      id: Date.now().toString(),
      jsonrpc: '2.0',
      method: rpcMethod,
      params: rpcParams
    }),
    headers,
    cache: 'default'
  }).then((httpResponse) => httpResponse.json())

  if (!jsonRpcResponse || Array.isArray(jsonRpcResponse) || typeof jsonRpcResponse !== 'object') {
    throw new Error(`RPC endpoint ${rpcUrl} returned non-object response.`)
  }
  const { error, result } = jsonRpcResponse

  if (error) {
    throw new Error(error?.message || error)
  }
  return result
}
export default jsonRpcRequest
