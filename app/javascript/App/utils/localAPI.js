import API from './API'

export default {
  get(path, data, remote) {
    return API.get(path, data, false)
  },
  post(path, data, remote) {
    return API.post(path, data, false)
  },
  patch(path, data, remote) {
    return API.patch(path, data, false)
  },
  delete(path, data, remote) {
    return API.delete(path, data, false)
  }
}
