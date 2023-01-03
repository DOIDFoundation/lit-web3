// Simple fetch wrapper

const checkStatus = function (response: Response) {
  let { status: code, statusText: message } = response
  if (response.ok) return response // HTTP-status 200-299
  if (!message) message += code
  let error = new Error(message)
  Object.assign(error, { raw: response, code, message })
  throw error
}

// Normalize response
const parseRes = function (response: any) {
  const contentType = response.headers.get('content-type')
  if (/^image\//.test(contentType)) return response.blob()
  if (/(markdown|plain)$/.test(contentType)) return response.text()
  return response
    .json()
    .catch(function (err: Error) {
      throw err // JSON parse error
    })
    .then(function (res: any) {
      const data = res.data ?? res.result ?? res
      const code = res.error_code ?? data.error_code ?? data.code ?? data.error ?? res.code ?? response.status
      if (code && ![200].includes(code)) {
        // Response error
        const message =
          data.error_message || data.error_msg || data.message || data.msg || res.msg || res.message || res.data
        throw Object.assign(new Error(code), { code, message, raw: response })
      }
      return data
    })
}

type Jsonish = Record<string, unknown>

const http = async function (uri: string, options: Jsonish = {}) {
  const opts = {
    method: 'GET',
    headers: {
      accept: 'application/json, */*'
    },
    mode: 'cors',
    credentials: 'same-origin'
  }
  Object.assign(options, opts, options)
  if (options.headers) Object.assign(options.headers, opts.headers, options.headers)
  return fetch(uri, options)
    .then(checkStatus)
    .then(parseRes)
    .catch(function (err: any) {
      throw err
    })
}

export const isRelativePath = (uri: string) => !/^(?:[a-z+]+:)?\/\//.test(uri)
export const getBaseUri = (uri: string) =>
  isRelativePath(uri) ? location.origin + (/^\//.test(uri) ? '' : location.pathname) : uri
export const mergeSearch = function (uri: string, json: Jsonish = {}) {
  const url = new URL(uri, getBaseUri(uri))
  for (let k in json) url.searchParams.set(k, json[k] as string)
  return url.toString()
}

export class Http {
  public fetch: Function
  constructor() {
    this.fetch = http
  }
  get(uri: string, json: Jsonish = {}) {
    return http(mergeSearch(uri, json))
  }
  post(uri: string, json = {}, { method = 'POST', form = false, search = false } = {}) {
    const body = form ? new URLSearchParams(json).toString() : JSON.stringify(json)
    return http(search ? mergeSearch(uri, json) : uri, {
      method,
      headers: {
        'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json'
      },
      body
    })
  }
  delete(uri: string, json: Jsonish = {}, options = {}) {
    return this.post(uri, json, { ...options, method: 'DELETE' })
  }
}

export default new Http()