import axios, { AxiosResponse } from 'axios'
import * as qs from 'qs'
import * as P from 'bluebird'

P.config({
  cancellation: true,
})

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

const request = (
  path,
  data = {},
  remote = true,
  type = 'get',
): any | AxiosResponse<any> => {
  let config = {}
  let endpoint = '/api'
  let params = data
  const headers = {
    'X-CSRF-Token': document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content'),
  }
  if (type === 'get') {
    params = { params }
  }
  if (remote) {
    endpoint = (window as any).pricesURL
  }
  if (!remote) {
    config = { headers }
  }
  const url = `${endpoint}${path}`
  return new P((resolve) => {
    if (type === 'delete') {
      axios
        .delete(url, { data, headers })
        .then((response) => {
          resolve(response.data || response)
        })
        .catch((error) => {
          console.log(error) // tslint:disable-line
        })
      return
    }
    axios[type](url, params, config)
      .then((response) => {
        resolve(response.data || response)
      })
      .catch((error) => {
        console.log(error) // tslint:disable-line
      })
  })
}

export default {
  get(path, data?, remote?) {
    return request(path, data, remote, 'get')
  },
  post(path, data?, remote?) {
    return request(path, data, remote, 'post')
  },
  patch(path, data?, remote?) {
    return request(path, data, remote, 'patch')
  },
  delete(path, data?, remote?) {
    return request(path, data, remote, 'delete')
  },
}
