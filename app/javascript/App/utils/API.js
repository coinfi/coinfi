import axios from 'axios'

const request = (path, data = {}, remote = true, type = 'get') => {
  let config = {}
  let endpoint = '/api'
  if (remote) {
    endpoint = process.env['COINFI_PRICES_URL']
  } else {
    config = {
      headers: {
        'X-CSRF-Token': document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute('content')
      }
    }
  }
  const url = `${endpoint}${path}`
  return new Promise(resolve => {
    if (type === 'delete') {
      axios
        .delete(url, { data, headers: config.headers })
        .then(response => {
          const d = remote ? response : response.data
          resolve(d)
        })
        .catch(error => {
          console.log(error)
        })
      return
    }
    axios[type](url, data, config)
      .then(response => {
        const d = remote ? response : response.data
        resolve(d)
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
