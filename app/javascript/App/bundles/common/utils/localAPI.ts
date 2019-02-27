import API from './API'

export default {
  get(path, data?) {
    return API.get(path, data, false)
  },
  post(path, data?) {
    return API.post(path, data, false)
  },
  patch(path, data?) {
    return API.patch(path, data, false)
  },
  delete(path, data?) {
    return API.delete(path, data, false)
  },
}
