import axios from 'axios'
import qs from 'qs'

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

const request = (path, data = {}, remote = true, type = 'get') => {
  let config = {}
  let endpoint = '/api'
  let params = data
  const headers = {
    'X-CSRF-Token': document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content')
  }
  if (type === 'get') params = { params }
  if (remote) endpoint = window.pricesURL
  if (!remote) config = { headers }
  const url = `${endpoint}${path}`
  return new Promise(resolve => {
    if (type === 'delete') {
      axios
        .delete(url, { data, headers })
        .then(response => {
          resolve(response.data || response)
        })
        .catch(error => {
          console.log(error)
        })
      return
    }
    axios[type](url, params, config)
      .then(response => {
        resolve(response.data || response)
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export default {
  get(path, data, remote) {
    return request(path, data, remote, 'get')
  },
  post(path, data, remote) {
    return request(path, data, remote, 'post')
  },
  patch(path, data, remote) {
    return request(path, data, remote, 'patch')
  },
  delete(path, data, remote) {
    return request(path, data, remote, 'delete')
  }
}
