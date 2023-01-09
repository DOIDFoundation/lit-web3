import http, { Jsonish } from './http'

export const genWhere = (params: Jsonish = {}): string => {
  let conditions: string[] = []
  for (let k in params) {
    let v = params[k]
    if (v) conditions.push(`${k}:"${v}"`)
  }
  return conditions.join(' ')
}

export const genPaging = (paging?: Pagination) => {
  if (!paging) return ''
  const { page, pageSize } = paging
  const str: string[] = []
  if (pageSize) {
    str.push(`first:${pageSize}`)
    if (page && page > 1) str.push(`skip:${+pageSize * (+page - 1)}`)
  }
  return str.join(' ')
}

export const subgraphQuery = async (api: string, query: string): Promise<any> => {
  let res = {}
  if (!api) throw new Error(`No support`)
  try {
    res = await http.post(api, { query })
  } catch (e: any) {
    throw new Error('GRAPH_QUERY_FAILED:' + e)
  }
  return res
}
