import 'whatwg-fetch'

export function request(method = 'GET', path, params) {
  let url
  const req = requestBody()

  if (method === 'GET') {
    url = requestURL({ path, params })
  } else {
    url = requestURL({ path })
    req.method = method
    req.body = JSON.stringify(params)
  }

  return fetch(url, req)
    .then(r => r.json())
    .then(r => {
      if (r.error) {
        if (r.error.backtrace) {
          console.error(`%c ${r.error.backtrace}`, ConsoleErrorStyle)
        }
        throw r
      } else {
        return r
      }
    })
}

export function get(path, params) {
  return request('GET', path, params)
}

export function post(path, params) {
  return request('POST', path, params)
}

export function patch(path, params) {
  return request('PATCH', path, params)
}

export function destroy(path, params) {
  return request('DELETE', path, params)
}

//

const requestURL = opts => {
  let url = opts.path
  if (opts.params) {
    url = `${url}?${toQueryString(opts.params)}`
  }
  return url
}

function requestBody() {
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
}

const toQueryString = (obj, urlEncode = false) => {
  if (!obj) return null
  const flattenObj = (x, path = []) => {
    const result = []
    Object.keys(x).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(x, key)) return
      const newPath = path.slice()
      newPath.push(key)
      let vals = []
      if (typeof x[key] === 'object') {
        vals = flattenObj(x[key], newPath)
      } else {
        vals.push({ path: newPath, val: x[key] })
      }
      vals.forEach(v => result.push(v))
    })
    return result
  }

  let parts = flattenObj(obj)
  parts = parts.map(varInfo => {
    if (varInfo.path.length === 1) {
      varInfo.path = varInfo.path[0]
    } else {
      const first = varInfo.path[0]
      const rest = varInfo.path.slice(1)
      varInfo.path = `${first}[${rest.join('][')}]`
    }
    return varInfo
  })

  const queryString = parts
    .map(varInfo => `${varInfo.path}=${varInfo.val}`)
    .join('&')
  if (urlEncode) {
    return encodeURIComponent(queryString)
  }
  return queryString
}

const ConsoleErrorStyle = [
  'color: #ff7e00',
  'display: block',
  'line-height: 20px',
  'padding: 5px'
].join(';')
