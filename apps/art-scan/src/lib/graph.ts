import { getGraph } from '@lit-web3/ethers/src/useBridge'
type KV = Record<string, any>

const parseRes = async (res: any) => {
  return res.data || res.result || res
  // return res
  //   .json()
  //   .then((r: any) => {
  //     let data = r.data || r.result || r
  //     return data
  //   })
  //   .catch((err: Error) => {
  //     throw err
  //   })
}

const assignError = (uri: string, options: any) => {
  return (err: any) => {
    throw err
  }
}

const authFetch = (uri: string, options?: any = {}): any => {
  return fetch(uri, options)
    .then((res) => {
      if (res.ok) return res
      const { status: code, statusText: message } = res
      throw new Error(message + code)
    })
    .then(parseRes)
    .catch(assignError(uri, options))
}

const postFetch = (uri: string, json: any = {}, { method = 'POST' }: any = {}) => {
  const options = { method, headers: { 'Content-Type': 'application/json', accept: 'application/json, */*' } }
  const body = JSON.stringify(json)

  return authFetch(uri, { ...options, body }).then((data: any) => data)
}

export const subgraphQuery =
  (path = '') =>
  async (query: string) => {
    const api = (await getGraph(path)) || ''
    if (!api) throw new Error('Not support')
    let res = {}
    try {
      res = await postFetch(api, { query }, { method: 'POST' })
    } catch (e) {
      throw new Error('GRAPH_QUERY_FAILED')
    }
    return res
  }
