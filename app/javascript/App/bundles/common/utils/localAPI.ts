import API from './API'

export default {
  source() {
    return API.source()
  },
  get(path, data?, cancelToken?) {
    return API.get(path, data, false, cancelToken)
  },
  post(path, data?, cancelToken?) {
    return API.post(path, data, false, cancelToken)
  },
  patch(path, data?, cancelToken?) {
    return API.patch(path, data, false, cancelToken)
  },
  delete(path, data?, cancelToken?) {
    return API.delete(path, data, false, cancelToken)
  },
}
