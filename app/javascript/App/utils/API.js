import axios from 'axios'

const get = path => {
  return new Promise(resolve => {
    axios
      .get(`${process.env['COINFI_PRICES_URL']}${path}`)
      .then(data => {
        resolve(data)
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export default { get }
