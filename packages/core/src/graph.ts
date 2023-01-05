import http from './http'

type Jsonish = Record<string, unknown>

export const genWhere = (params?: Object, options: Jsonish = { allowEmpty: true, brackets: false }): string => {
  if (!params) {
    return ''
  }
  const str: string[] = []
  let empty_param = true
  for (let k in params) {
    let val: any = params[k]
    if (options.allowEmpty) {
      str.push(`${k}: "${val}"`)
      empty_param = false
    } else if (val || val == '0') {
      empty_param = false
      str.push(`${k}: "${val}"`)
    }
  }
  const query = str.length ? `${str.join(', ')}` : ''
  return options.brackets ? `(where: {${query}})` : `${options.allowEmpty || !empty_param ? `where: {${query}}` : ''}`
}

export const subgraphQuery = async (query: string, api: string) => {
  let res = {}
  if (!api) throw new Error(`No support`)
  try {
    res = await http.post(api, { query: query })
  } catch (e: any) {
    throw new Error('GRAPH_QUERY_FAILED:' + e)
  }
  return res
}
