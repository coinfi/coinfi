import qs from 'qs'

export const getQueryObject = () => {
  const search = window.location.search
  if (search) return qs.parse(search.substr(1))
  return {}
}

export const currentURL = (opts) => {
  opts = opts || {}
  let { withQuery, queryObject } = opts
  withQuery = withQuery === false ? false : true
  let href = window.location.href
  if (queryObject) {
    const queryString = qs.stringify(queryObject, { encode: false })
    href = href.split('?')[0]
    return `${href}?${queryString}`
  } else {
    return withQuery ? href : href.split('?')[0]
  }
}

export const pushObjectToURL = (object) => {
  if (object.q) {
    object.q = escapeAmpersands(object.q)
  }
  const queryString = qs.stringify(object, { encode: false })
  window.history.pushState(object, document.title, `?${queryString}`)
}

function escapeAmpersands(object) {
  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val, index) => {
        if (val.includes && val.includes('&')) {
          object[key][index] = val.replace('&', '%26')
        }
      })
    }
  })
  return object
}
