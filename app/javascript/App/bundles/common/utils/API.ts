import axios, { AxiosResponse } from 'axios'
import * as qs from 'qs'

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

const request = (
  path,
  data = {},
  remote = true,
  type = 'get',
  cancelToken = null,
): any | AxiosResponse<any> => {
  let config: any = {}
  let endpoint = '/api'
  const params = data
  const headers = {
    'X-CSRF-Token': document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content'),
  }
  if (remote) {
    endpoint = (window as any).pricesURL
  } else {
    config = { ...config, headers }
  }
  if (cancelToken !== null) {
    config = { ...config, cancelToken }
  }
  const url = `${endpoint}${path}`
  if (type === 'delete' || type === 'get') {
    if (type === 'get') {
      config = { ...config, params }
    } else if (type === 'delete') {
      config = { ...config, data }
    }
    return axios[type](url, config).then((response) => {
      return response.data || response
    })
  }
  return axios[type](url, params, config).then((response) => {
    return response.data || response
  })
}

export default {
  source() {
    return axios.CancelToken.source()
  },
  get(path, data?, remote?, cancelToken?) {
    return request(path, data, remote, 'get', cancelToken)
  },
  post(path, data?, remote?, cancelToken?) {
    return request(path, data, remote, 'post', cancelToken)
  },
  patch(path, data?, remote?, cancelToken?) {
    return request(path, data, remote, 'patch', cancelToken)
  },
  delete(path, data?, remote?, cancelToken?) {
    return request(path, data, remote, 'delete', cancelToken)
  },
}
